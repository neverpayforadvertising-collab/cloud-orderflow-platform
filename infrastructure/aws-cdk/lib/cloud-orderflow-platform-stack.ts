import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CloudOrderflowPlatformStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TODO: define API Gateway, Lambda functions, SQS queue, SNS topic, DynamoDB table, S3 bucket, and IAM roles.
  }
}
