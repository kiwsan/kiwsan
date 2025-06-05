import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigatewayv2Integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { SecurityPolicyProtocol } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as core from 'aws-cdk-lib/core';

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

    const httpOrigin = new origins.HttpOrigin(core.Fn.select(1, core.Fn.split('://', httpApi.apiEndpoint)), {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY
    });

    const certificate = Certificate.fromCertificateArn(this, "ImportCertificateArn", "arn:aws:acm:us-east-1:596990421883:certificate/44b1bf93-7684-4b73-8479-10a155a604c9");

    // CloudFront distribution that provides HTTPS
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: httpOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: cdk.aws_cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: cdk.aws_cloudfront.ResponseHeadersPolicy.fromResponseHeadersPolicyId(this, "ImportResponseHeadersPolicy", "ce620104-f9b9-4fff-9eb1-cfcab9ca28cd")
      },
      domainNames: ["api.kiwsan.com"],
      certificate: certificate,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    // Output API URL
    new cdk.CfnOutput(this, 'HttpApiUrl', {
      value: distribution.domainName,
      description: 'The URL of the HTTP API endpoint',
    });

  }
}
