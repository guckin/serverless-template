#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HelloWorldServiceStack } from '../lib/hello-world-stack';

const app = new cdk.App();
new HelloWorldServiceStack(app, 'HelloWorld', {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
