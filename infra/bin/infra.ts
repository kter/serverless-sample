#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TodoAppStack } from '../lib/infra-stack';

const app = new cdk.App();
new TodoAppStack(app, 'TodoAppStack');
