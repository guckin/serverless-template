#!/usr/bin/env node
import {App} from 'aws-cdk-lib';

import {RestApiStack} from './rest-api/rest-api.stack.js';
import {CertificateStack} from './certificate/certificate.stack.js';
import {domainName, stage, subdomain} from './config.js';

const app = new App();

const certStack = new CertificateStack(app, `Certificate-${stage}`, {
    stage,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'us-east-1'
    },
    crossRegionReferences: true,
    domainName,
    subdomain,
});

export const stack = new RestApiStack(app, `RestAPIStack-${stage}`, {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    crossRegionReferences: true,
    stage,
    certStack,
    domainName,
    subdomain,
});
