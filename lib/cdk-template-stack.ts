import {Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Pass, StateMachine, StateMachineType} from 'aws-cdk-lib/aws-stepfunctions';
import {RestApi, StepFunctionsIntegration} from 'aws-cdk-lib/aws-apigateway';

export class CdkTemplateStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);


        const pass = new Pass(this, 'PassState', {
            result: {value:"Hello!"},
        })

        const stateMachine = new StateMachine(this, 'MyStateMachine', {
            definition: pass,
            stateMachineType: StateMachineType.STANDARD,
        });

        const api = new RestApi(this, 'StepFunctionsRestApi', {
            restApiName: 'StateMachineAPI',
            deploy: true
        });

        api.root.addMethod('POST', StepFunctionsIntegration.startExecution(stateMachine));
    }
}
