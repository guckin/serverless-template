import {SourceMapMode, BundlingOptions} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';

export const bundlingOptions: BundlingOptions = {
  minify: true,
  sourceMap: true,
  sourceMapMode: SourceMapMode.INLINE,
  sourcesContent: false,
  target: 'esNext',
  bundleAwsSDK: true,
  externalModules: ['@aws-sdk/*'],
};

export const stage = process.env.STAGE || 'dev';
export const domainName = 'slippys.cool';
export const subdomain = 'service-template';

export const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

export const nodeRuntime = Runtime.NODEJS_18_X
