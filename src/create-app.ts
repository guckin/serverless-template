#!/usr/bin/env node
import {App} from 'aws-cdk-lib';

import {RestApiStack} from './rest-api/rest-api.stack';
import {CertificateStack} from './certificate/certificate.stack';

const createApp = new App();
const stage = process.env.STAGE || 'dev';
const domainName = 'slippys.cool';
const subdomain = 'serverless-template';

const certStack = new CertificateStack(createApp, `Certificate-${stage}`, {
    stage,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'us-east-1'
    },
    crossRegionReferences: true,
    domainName,
    subdomain,
});

export const stack = new RestApiStack(createApp, `RestAPIStack-${stage}`, {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    crossRegionReferences: true,
    stage,
    certStack,
    domainName,
    subdomain,
});
