#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HelloWorldServiceStack } from './hello-world-stack';

const app = new cdk.App();
const stage = process.env.Stage || 'dev';
new HelloWorldServiceStack(app, `HelloWorld-${stage}`, {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    stage
});
