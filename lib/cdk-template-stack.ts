import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Pass, StateMachine, StateMachineType} from '@aws-cdk/aws-stepfunctions';
import {RestApi, StepFunctionsIntegration, StepFunctionsRestApi} from '@aws-cdk/aws-apigateway';

export class CdkTemplateStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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
