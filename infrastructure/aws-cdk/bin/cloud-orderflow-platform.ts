#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CloudOrderflowPlatformStack } from '../lib/cloud-orderflow-platform-stack';

const app = new cdk.App();
new CloudOrderflowPlatformStack(app, 'CloudOrderflowPlatformStack');
