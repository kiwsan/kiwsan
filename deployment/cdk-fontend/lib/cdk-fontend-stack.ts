// https://awstip.com/connecting-a-naked-domain-to-an-s3-hosted-website-with-cdk-bd8f43f23a3b

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

import * as path from 'path';
import { Function, OriginAccessIdentity, SecurityPolicyProtocol, ViewerProtocolPolicy, FunctionCode, FunctionEventType, CachePolicy, AllowedMethods, Distribution, HeadersFrameOption } from 'aws-cdk-lib/aws-cloudfront';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BucketAccessControl } from 'aws-cdk-lib/aws-s3';

// import * as sqs from 'aws-cdk-lib/aws-sqs';
// NOTE: See README.md for instructions on how to configure a Hosted Zone.
// CAUTION: Hosted Zones are not free, nor is their usage. Each domain you
//          configure will cost you a minimum of $0.50 per month (assuming
//          reasonable use)
//          See https://aws.amazon.com/route53/pricing/ for more details.

export class CdkFontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const domainName = "kiwsan.com";

    const zone = route53.HostedZone.fromLookup(this, domainName, {
      domainName: domainName
    });

    new CfnOutput(this, 'Site', { value: 'https://' + domainName });

    // create the site bucket
    const bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: `${domainName}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      accessControl: BucketAccessControl.PRIVATE,

      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      // removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code

      /**
       * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
       * setting will enable full cleanup of the demo.
       */
      // autoDeleteObjects: true, // NOT recommended for production code
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'CloudFrontOriginAccessIdentity', {
      comment: 'Restrict access to the S3 origin using Origin Access Identity',
    });

    // Uncomment the lines related to the subdomain if you want it connected as well
    // const subdomainName = `www.${domainName}`;

    // TLS certificate
    const dnsValidatedCertificate = new DnsValidatedCertificate(this, "DnsValidatedCertificate", {
      domainName: domainName,
      // subjectAlternativeNames: [subdomainName],
      hostedZone: zone,
      region: "us-east-1", // Cloudfront only checks us-east-1 (N. Virginia) for certificates.
    });

    new CfnOutput(this, 'dnsCertificate', { value: dnsValidatedCertificate.certificateArn });

    const cfFunction = new Function(this, 'HugoPaths', {
      code: FunctionCode.fromInline(`function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }
  return request;
}
`),
    });

    bucket.grantRead(originAccessIdentity);

    // CloudFront distribution that provides HTTPS
    const distribution = new Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: cfFunction,
            eventType: FunctionEventType.VIEWER_REQUEST,
          },
        ],
        originRequestPolicy: cdk.aws_cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: new cdk.aws_cloudfront.ResponseHeadersPolicy(this, "ResponseHeadersPolicy", {
          responseHeadersPolicyName: "CustomResponseHeadersPolicy",
          comment: "Custom Header Policy for kiwsan.com",
          corsBehavior: {
            accessControlAllowOrigins: ["*"],
            accessControlAllowHeaders: ["*"],
            accessControlAllowMethods: ["GET", "DELETE", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
            accessControlMaxAge: cdk.Duration.seconds(600),
            accessControlExposeHeaders: [],
            accessControlAllowCredentials: false,
            originOverride: true,
          },
          customHeadersBehavior: {
            customHeaders: [
              {
                header: "Permissions-Policy",
                value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
                override: true
              },
              {
                header: "X-Powered-By",
                value: "kiwsan, Inc.",
                override: true
              }
            ]
          },
          securityHeadersBehavior: {
            strictTransportSecurity: {
              accessControlMaxAge: cdk.Duration.seconds(31536000),
              preload: true,
              includeSubdomains: true,
              override: true
            },
            contentTypeOptions: {
              override: true
            },
            frameOptions: {
              frameOption: HeadersFrameOption.DENY,
              override: true
            },
            xssProtection: {
              override: true,
              protection: true,
              modeBlock: true
            },
            referrerPolicy: {
              override: true,
              referrerPolicy: cdk.aws_cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN
            },
            contentSecurityPolicy: {
              override: true,
              contentSecurityPolicy: "frame-ancestors 'self'; default-src 'self' ; object-src 'none' ; script-src 'self'; style-src  'self' https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com data:; img-src 'self' data:;"
            }
          },
          removeHeaders: ["server"],
          serverTimingSamplingRate: 0.0001
        })
      },
      domainNames: [domainName],
      certificate: dnsValidatedCertificate,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responsePagePath: '/index.html',
          responseHttpStatus: 200,
        },
        {
          httpStatus: 404,
          responsePagePath: '/404.html',
          responseHttpStatus: 200,
        },
      ],
    });

    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

    // Route53 record for the naked domain
    new route53.ARecord(this, "DomainAliasARecord", {
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone,
    });

    // Route53 record for the subdomain
    /*new CnameRecord(this, "SiteCnameRecord", {
      recordName: subdomainName,
      domainName: distribution.distributionDomainName,
      zone,
    });*/

    // Deploy the static website to the site bucket
    // The contents of ./static-website are the contents of the website's root folder
    // The distribution must be specified in order to perform cache invalidation, up
    // to 1000 invalidations free per month
    new BucketDeployment(this, "BucketDeployment", {
      sources: [Source.asset(path.resolve(__dirname, '..', '..', '..', './src/public'))],
      destinationBucket: bucket,
      distribution: distribution,
      distributionPaths: ['/', '/index.html'],
    });

  }
}
