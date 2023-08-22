// https://awstip.com/connecting-a-naked-domain-to-an-s3-hosted-website-with-cdk-bd8f43f23a3b

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

import * as path from 'path';
import { OriginAccessIdentity, CloudFrontWebDistribution, SSLMethod, SecurityPolicyProtocol, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { RemovalPolicy } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

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

    // create the site bucket
    const siteBucket = new s3.Bucket(this, 'Bucket', {
      bucketName: domainName,
      publicReadAccess: true, // your bucket will be browsable directly via unsecured HTTP
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      accessControl: s3.BucketAccessControl.PRIVATE,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      encryption: s3.BucketEncryption.S3_MANAGED,
      websiteIndexDocument: "index.html",
      autoDeleteObjects: true, // NOT recommended for production code
    });

    // Uncomment the lines related to the subdomain if you want it connected as well
    // const subdomainName = `www.${domainName}`;

    // TLS certificate
    const dnsValidatedCertificate = new DnsValidatedCertificate(this, "SiteCertificate",
      {
        domainName: domainName,
        // subjectAlternativeNames: [subdomainName],
        hostedZone: zone,
        region: "us-east-1", // Cloudfront only checks us-east-1 (N. Virginia) for certificates.
      }
    );

    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');

    // Assuming you have 'bucket' defined somewhere
    siteBucket.grantRead(originAccessIdentity);

    // CloudFront distribution that provides HTTPS
    const distribution = new CloudFrontWebDistribution(this, "CloudFrontWebDistribution", {
      viewerCertificate: {
        aliases: [domainName /*, subdomainName*/],
        props: {
          acmCertificateArn: dnsValidatedCertificate.certificateArn,
          sslSupportMethod: SSLMethod.SNI,
          minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
        },
      },
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      defaultRootObject: 'index.html',
      errorConfigurations: [{
        errorCode: 403,
        responseCode: 403,
        responsePagePath: '/error.html',
      }],
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket,
            originAccessIdentity: originAccessIdentity,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    }
    );

    // Route53 record for the naked domain
    new route53.ARecord(this, "SiteAliasARecord", {
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
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
      sources: [Source.asset(path.resolve(__dirname, '..', '..', '..', './dist'))],
      destinationBucket: siteBucket,
      distribution: distribution
    });

  }
}
