import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {JsonPath, StateMachine, StateMachineType} from 'aws-cdk-lib/aws-stepfunctions';
import {JsonSchemaType, Model, RestApi, StepFunctionsIntegration} from 'aws-cdk-lib/aws-apigateway';
import {AttributeType, Table} from 'aws-cdk-lib/aws-dynamodb';
import {DynamoAttributeValue, DynamoPutItem, LambdaInvoke} from 'aws-cdk-lib/aws-stepfunctions-tasks';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class CdkTemplateStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const dynamoTable = new Table(this, 'DogTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            }
        });

        dynamoTable.autoScaleWriteCapacity({
            minCapacity: 1,
            maxCapacity: 10
        });

        // TODO: this function is not deploying
        // const uuidFunction = new NodejsFunction(this, 'UUIDFunction', {
        //     entry:  path.join(__dirname, `./uuid.ts`),
        //     handler: 'uuidHandler',
        //     runtime: Runtime.NODEJS_16_X
        // });
        //
        // const uuidInvoke = new LambdaInvoke(this, 'uuid', {
        //     lambdaFunction: uuidFunction
        // });

        const dynamoPutItem = new DynamoPutItem(this, 'PutItem', {
            item: {
                id: DynamoAttributeValue.fromString(JsonPath.stringAt('$.body.id')),
                name: DynamoAttributeValue.fromString(JsonPath.stringAt('$.body.name')),
                breed: DynamoAttributeValue.fromString(JsonPath.stringAt('$.body.breed'))
            },
            table: dynamoTable,
            resultPath: '$.Item',
        });

        // const stateMachineDefinition = uuidInvoke.next(dynamoPutItem);

        const stateMachine = new StateMachine(this, 'MyStateMachine', {
            definition: dynamoPutItem,
            stateMachineType: StateMachineType.EXPRESS,
        });

        const api = new RestApi(this, 'StepFunctionsRestApi', {
            restApiName: 'StateMachineAPI',
            deploy: true
        });

        const dogModel: Model = api.addModel(
            'DogModel',
            {
                schema: {
                    type: JsonSchemaType.OBJECT,
                    properties: {
                        // TODO: remove me
                        id: {
                            type: JsonSchemaType.STRING
                        },
                        name: {
                            type: JsonSchemaType.STRING
                        },
                        breed: {
                            type: JsonSchemaType.STRING
                        }
                    },
                    required: ['name', 'breed']
                }
            }
        );

        api.root.resourceForPath('/dogs').addMethod(
            'POST',
            StepFunctionsIntegration.startExecution(stateMachine),
            {
                requestModels: {
                    'application/json': dogModel
                },
                requestValidatorOptions: {
                    validateRequestBody: true
                }
            }
        );
    }
}
