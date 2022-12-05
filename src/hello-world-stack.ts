import {Stack, StackProps} from 'aws-cdk-lib';
import { Integration, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import {Construct} from 'constructs';
import { helloWorldHandlerName, hellowWorldPath } from './container';

export class HelloWorldServiceStack extends Stack {
    constructor(
        scope: Construct,
        id: string,
        props?: StackProps
    ) {
        super(scope, id, props);
        this.createTable();
        this.createTopic();
        this.createApi();
    }

    private createTable() {
        new Table(this, 'HelloworldTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: 'HelloWorldTable',
        });    
    }

    private createTopic() { 
        new Topic(this, 'HelloWorldTopic'); 
    }

    private createApi() {
       const serverlessRestApi = new ServerlessRestApi(this, 'HelloWorldApi');
       serverlessRestApi.addEndpoint('GetHelloWorld', {
            method: 'GET',
            path: 'hello-world',
            entry: hellowWorldPath,
            handler: helloWorldHandlerName,
       });
    }

}

export type RestEndpointConfiguration = Readonly<{
    entry: string;
    handler: string;
    path: string;
    method: string;
}>;

class ServerlessRestApi {

    private readonly api = new RestApi(this.scope, this.id, {
        cloudWatchRole: true
    });

    private readonly lambdaFactory = new NodeJsLambdaFactory(this.scope);

    constructor(private readonly scope: Construct, private readonly id: string) {
    }

    addEndpoint(id: string, {entry, handler, path, method}: RestEndpointConfiguration) {
        const lambda = this.createLambda(id, entry, handler);
        const lambdaIntegration = this.createIntegration(lambda);
        this.createResource(path, method, lambdaIntegration);
    }

    private createIntegration(lambda: NodejsFunction): LambdaIntegration {
        return new LambdaIntegration(lambda);
    }

    private createLambda(id: string, entry: string, handler: string): NodejsFunction {
        return this.lambdaFactory.createLambda(id, entry, handler);
    }

    private createResource(path: string, method: string, integration: Integration): void {
        this.api.root.addResource(path).addMethod(method, integration);
    }
}


export interface LambdaProps {
    readonly entry: string, 
    readonly handler: string
}
class NodeJsLambdaFactory {

    constructor(private readonly scope: Construct) {
    }

    createLambda(id: string, entry: string, handler: string): NodejsFunction {
        return new NodejsFunction(this.scope, id, {
            entry,
            handler,
            runtime: Runtime.NODEJS_16_X,
            environment: {
                NODE_OPTIONS: '--enable-source-maps',
              },
        });
    }
}