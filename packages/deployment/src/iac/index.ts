#!/usr/bin/env node
import {App} from 'aws-cdk-lib';

import {RestApiStack} from 'rest-api';
import {CertificateStack} from './certificate.stack.js';
import {domainName, subdomain, env, appName} from 'config';

const app = new App();

const certStack = new CertificateStack(app, `${appName}-certificate-stack`, {
    env: {
        ...env,
        region: 'us-east-1'
    },
    crossRegionReferences: true,
    domainName,
    subdomain,
});

export const stack = new RestApiStack(app, `${appName}-rest-api-stack`, {
    env,
    crossRegionReferences: true,
    certificate: certStack.cert,
    domainName,
    subdomain,
});
