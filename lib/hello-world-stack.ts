import {Stack, StackProps} from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import {Construct} from 'constructs';
import * as path from 'path';
import { helloWorldHandler, helloWorldHandlerName, hellowWorldPath } from './container';

export class HelloWorldStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);       
        this.createTable();
        this.createTopic();
        this.createFunction();
    }

    private readonly createTable = () => new Table(this, 'HelloworldTable', {
        partitionKey: {
            name: 'id',
            type: AttributeType.STRING
        },
        tableName: 'HelloWorldTable',
    });

    private readonly createTopic = () => new Topic(this, 'HelloWorldTopic');

    private readonly createFunction = () => new NodejsFunction(this, 'HelloWorldFunction ', {
        entry: hellowWorldPath,
        handler: helloWorldHandlerName,
        runtime: Runtime.NODEJS_16_X,
        environment: {
            NODE_OPTIONS: '--enable-source-maps',
          },
    });
}
