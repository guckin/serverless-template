#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HelloWorldStack } from '../lib/hello-world-stack';

const app = new cdk.App();
new HelloWorldStack(app, 'CdkTemplateStack', {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
