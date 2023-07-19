import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

export class TodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table
    const table = new dynamodb.Table(this, 'Todos', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    // Create SNS topic
    const topic = new sns.Topic(this, 'TodoNotification');

    // Create EventBridge rule
    const rule = new events.Rule(this, 'TodoReminder', {
      schedule: events.Schedule.cron({ minute: '0', hour: '8' }),
    });

    // Add targets to rule
    rule.addTarget(new targets.SnsTopic(topic, {
      message: events.RuleTargetInput.fromText('A todo item is due within 24 hours'),
    }));

    // Subscribe to SNS topic
    topic.addSubscription(new subs.EmailSubscription('user@example.com'));

    // Define the IAM role for API Gateway
    const apiGwRole = new iam.Role(this, 'TodoAPIGatewayRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    table.grantReadWriteData(apiGwRole);

    // Create the API Gateway with the DynamoDB integration
    const api = new apigw.RestApi(this, 'TodoAPI', {
      restApiName: 'Todo Service',
      deployOptions: {
        metricsEnabled: true,
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        stageName: 'prod',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: ['*'],
      },
    });

    const getTodosIntegration = new apigw.AwsIntegration({
      service: 'dynamodb',
      action: 'Scan',
      options: {
        credentialsRole: apiGwRole,
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': '{"todos": $input.json("$.Items")}',
            },
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        ],
        requestTemplates: {
          'application/json': `{"TableName": "${table.tableName}"}`,
        },
      },
    });

    const addTodosIntegration = new apigw.AwsIntegration({
      service: 'dynamodb',
      action: 'PutItem',
      options: {
        credentialsRole: apiGwRole,
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': '{"todos": $input.json("$.Items")}',
            },
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        ],
        requestTemplates: {
          'application/json': `{"TableName": "${table.tableName}", "Item": {"id": {"S": "$context.requestId"}, "title": {"S": "$input.path("$.title")"}, "completed": {"BOOL": false}}}`,
        },
      },
    });

    const removeTodosIntegration = new apigw.AwsIntegration({
      service: 'dynamodb',
      action: 'DeleteItem',
      options: {
        credentialsRole: apiGwRole,
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': '{"todos": $input.json("$.Items")}',
            },
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        ],
        requestTemplates: {
          'application/json': `{"TableName": "${table.tableName}", "Key": {"id": {"S": "$input.path("$.id")"}}}`,
        },
      },
    });

    const todoResource = api.root.addResource('todos');
    const responseModel = api.addModel('ResponseModel', {
      contentType: 'application/json',
      modelName: 'ResponseModel',
      schema: {
        schema: apigw.JsonSchemaVersion.DRAFT4,
        title: 'responseModel',
        type: apigw.JsonSchemaType.OBJECT,
      },
    });
    
    todoResource.addMethod('GET', getTodosIntegration, {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
        },
        responseModels: {
          'application/json': responseModel,
        },
      }],
    });
    todoResource.addMethod('POST', addTodosIntegration, {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
        },
        responseModels: {
          'application/json': responseModel,
        },
      }],
    });
    todoResource.addResource('{id}').addMethod('DELETE', removeTodosIntegration, {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
        },
        responseModels: {
          'application/json': responseModel,
        },
      }],
    });
  }
}

const app = new cdk.App();
new TodoAppStack(app, 'TodoAppStack');
app.synth();
