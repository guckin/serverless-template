#!/usr/bin/env node
import {App} from 'aws-cdk-lib';
import { HelloWorldServiceStack } from './hello-world-stack';

const app = new App();
const stage = process.env.STAGE || 'dev';
export const stack = new HelloWorldServiceStack(app, `HelloWorld-${stage}`, {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    stage
});
