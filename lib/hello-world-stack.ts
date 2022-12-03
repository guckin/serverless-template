import {Stack, StackProps} from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import {Construct} from 'constructs';
import * as path from 'path';

export class HelloWorldStack extends Construct {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id);
        new SomeComponent(scope, 'SomeComponent', props);
    }
}

export class SomeComponent extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);       
        this.someTable();
        this.someTopic();
        this.someFunction();
    }

    private readonly someTable = () => new Table(this, 'SomeTable', {
        partitionKey: {
            name: 'id',
            type: AttributeType.STRING
        },
        tableName: 'SomeTable',
    });

    private readonly someTopic = () => new Topic(this, 'SomeTopic');

    private readonly someFunction = () => new NodejsFunction(this, 'SomeFunction', {
        entry: path.join(__dirname, 'container.ts'),
        handler: 'helloworldHandler',
        runtime: Runtime.NODEJS_16_X,
        environment: {
            NODE_OPTIONS: '--enable-source-maps',
          },
    });
}
