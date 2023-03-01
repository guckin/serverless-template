import {Stack, StackProps} from 'aws-cdk-lib';
import * as path from 'path';
import {Construct} from 'constructs';
import {Code, Runtime, Function} from 'aws-cdk-lib/aws-lambda';
import {BasePathMapping, Cors, DomainName, EndpointType, LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {Certificate} from 'aws-cdk-lib/aws-certificatemanager';

export type HelloWorldProps = StackProps & {
    stage: string,
};

export class HelloWorldServiceStack extends Stack {
    constructor(scope: Construct, id: string, props: HelloWorldProps) {
        super(scope, id, props);

        const apiFunction = new Function(this, 'MyFunction', {
          runtime: Runtime.NODEJS_16_X,
          handler: 'hello-world-handler.handler',
          code: Code.fromAsset(path.join(__dirname, '..', 'build'))
        });

        const lambdaIntegration = new LambdaIntegration(apiFunction);

        const api = new RestApi(this, 'API', {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        });
        api.root.addMethod('GET', lambdaIntegration);

        const cert = Certificate.fromCertificateArn(
          this,
          'cert',
          'arn:aws:acm:us-east-1:084882962555:certificate/729d47e9-8d3b-439c-b4b5-e74a9a33cbce'
        );

        const domainName = new DomainName(this, 'DomainName', {
            domainName: `${props.stage}.api.helpfl.click`,
            certificate: cert,
            endpointType: EndpointType.EDGE,
        });

        new BasePathMapping(this, 'ApiMapping', {
            domainName: domainName,
            restApi: api,
            basePath: 'hello-world'
        });

    }
}
