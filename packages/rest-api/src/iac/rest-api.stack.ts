import {Duration, Stack, StackProps} from 'aws-cdk-lib';
import * as path from 'path';
import {Construct} from 'constructs';
import {Cors, EndpointType, LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {ARecord, HostedZone, RecordTarget} from 'aws-cdk-lib/aws-route53';
import {ApiGateway} from 'aws-cdk-lib/aws-route53-targets';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {bundlingOptions, nodeRuntime} from 'config';
import {ICertificate} from 'aws-cdk-lib/aws-certificatemanager';
import {appName} from 'config';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export type RestApiStackProps = StackProps & {
  certificate: ICertificate,
  subdomain: string,
  domainName: string,
};

export class RestApiStack extends Stack {
  constructor(scope: Construct, id: string, props: RestApiStackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, `${appName}-rest-api-handler`, {
      entry: path.join(__dirname, '../handler.js'),
      handler: 'handler',
      timeout: Duration.seconds(100),
      runtime: nodeRuntime,
      bundling: bundlingOptions
    });

    const lambdaIntegration = new LambdaIntegration(fn);

    const api = new RestApi(this, `${appName}-rest-api-gateway`, {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      },
    });

    api.root.addProxy({defaultIntegration: lambdaIntegration});

    api.addDomainName('domain-name', {
      domainName: `${props.subdomain}.${props.domainName}`,
      certificate: props.certificate,
      endpointType: EndpointType.EDGE
    });

    new ARecord(this, 'a-record', {
      recordName: `${props.subdomain}.${props.domainName}`,
      target: RecordTarget.fromAlias(new ApiGateway(api)),
      zone: HostedZone.fromLookup(this, 'HostedZone', {
        domainName: props.domainName
      })
    });

  }
}
