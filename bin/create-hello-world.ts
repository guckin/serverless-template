#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HelloWorldStack } from '../lib/hello-world-stack';

const app = new cdk.App();
new HelloWorldStack(app, 'CdkTemplateStack');
