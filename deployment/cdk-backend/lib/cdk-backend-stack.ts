import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigatewayv2Integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';

export class CdkBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const aspNetLambda = new lambda.Function(this, 'AspNetLambdaFunction', {
      runtime: lambda.Runtime.DOTNET_6,  // Modify according to your .NET Core version
      handler: 'AWSServerless::AWSServerless.LambdaEntryPoint::FunctionHandlerAsync',
      code: lambda.Code.fromAsset('./lib/AWSServerless/publish'),
      functionName: "AspNetLambdaFunction",
      architecture: cdk.aws_lambda.Architecture.ARM_64
    });

    // Create the HTTP API
    const httpApi = new apigatewayv2.HttpApi(this, 'MyHttpApi', {
      // disableExecuteApiEndpoint: true,
    });

    const lambdaIntegration = new apigatewayv2Integrations.HttpLambdaIntegration("MyHttpLambdaIntegration", aspNetLambda);

    // Add the default route to the Lambda function
    httpApi.addRoutes({
      path: '/',
      integration: lambdaIntegration,
      methods: [HttpMethod.GET]
    });

    httpApi.addRoutes({
      path: '/api/values',
      integration: lambdaIntegration,
      methods: [HttpMethod.GET]
    });

    // Output API URL
    new cdk.CfnOutput(this, 'HttpApiUrl', {
      value: httpApi.apiEndpoint,
      description: 'The URL of the HTTP API endpoint',
    });

  }
}
