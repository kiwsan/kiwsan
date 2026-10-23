#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const security = JSON.parse(readFileSync(join(root, 'security.config.json'), 'utf8'));
const apply = process.argv.includes('--apply');
const distributionId = process.env.CF_DISTRIBUTION_ID ?? 'E2CAAH31O3E38E';
const backupDir = join(
  root,
  '.cloudfront',
  'backups',
  new Date().toISOString().replace(/[:.]/g, '-')
);

const aws = (args) => JSON.parse(execFileSync('aws', args, { encoding: 'utf8' }));
const applyAws = (args) => execFileSync('aws', args, { encoding: 'utf8', stdio: 'inherit' });

const writeTemp = (name, value) => {
  const file = join(tmpdir(), `kiwsan-${name}-${process.pid}.json`);
  writeFileSync(file, JSON.stringify(value, null, 2));
  return `file://${file}`;
};

const backup = (name, value) => {
  mkdirSync(backupDir, { recursive: true });
  writeFileSync(join(backupDir, `${name}.json`), JSON.stringify(value, null, 2));
};

const distribution = aws([
  'cloudfront',
  'get-distribution',
  '--id',
  distributionId,
  '--output',
  'json',
]);
const distributionConfig = distribution.Distribution.DistributionConfig;
const behavior = distributionConfig.DefaultCacheBehavior;

const headersPolicyId = behavior.ResponseHeadersPolicyId;
const cachePolicyId = behavior.CachePolicyId;

if (!headersPolicyId || !cachePolicyId) {
  throw new Error('The distribution must use response headers and cache policies.');
}

const headersPolicy = aws([
  'cloudfront',
  'get-response-headers-policy',
  '--id',
  headersPolicyId,
  '--output',
  'json',
]);
const cachePolicy = aws([
  'cloudfront',
  'get-cache-policy',
  '--id',
  cachePolicyId,
  '--output',
  'json',
]);

const headersConfig = structuredClone(
  headersPolicy.ResponseHeadersPolicy.ResponseHeadersPolicyConfig
);
const cacheConfig = structuredClone(cachePolicy.CachePolicy.CachePolicyConfig);
const nextDistributionConfig = structuredClone(distributionConfig);

headersConfig.SecurityHeadersConfig ??= {};
headersConfig.SecurityHeadersConfig.ContentSecurityPolicy ??= {};
const currentCsp =
  headersConfig.SecurityHeadersConfig.ContentSecurityPolicy.ContentSecurityPolicy ?? '';
headersConfig.SecurityHeadersConfig.ContentSecurityPolicy.ContentSecurityPolicy = security.csp;
headersConfig.SecurityHeadersConfig.ContentSecurityPolicy.Override = true;

const cacheParameters = cacheConfig.ParametersInCacheKeyAndForwardedToOrigin;
cacheParameters.EnableAcceptEncodingGzip = true;
cacheParameters.EnableAcceptEncodingBrotli = true;

nextDistributionConfig.DefaultCacheBehavior.Compress = true;
nextDistributionConfig.CustomErrorResponses = {
  Quantity: 2,
  Items: [
    {
      ErrorCode: 403,
      ResponsePagePath: '/404.html',
      ResponseCode: '404',
      ErrorCachingMinTTL: 300,
    },
    {
      ErrorCode: 404,
      ResponsePagePath: '/404.html',
      ResponseCode: '404',
      ErrorCachingMinTTL: 300,
    },
  ],
};

const cspChanged = currentCsp !== security.csp;
const cacheChanged =
  !cachePolicy.CachePolicy.CachePolicyConfig.ParametersInCacheKeyAndForwardedToOrigin
    .EnableAcceptEncodingGzip ||
  !cachePolicy.CachePolicy.CachePolicyConfig.ParametersInCacheKeyAndForwardedToOrigin
    .EnableAcceptEncodingBrotli;
const distributionChanged =
  JSON.stringify(nextDistributionConfig) !== JSON.stringify(distributionConfig);

console.log('CloudFront configuration plan');
console.log(`  distribution: ${distributionId}`);
console.log(
  `  response headers policy: ${headersPolicyId} (${cspChanged ? 'update CSP' : 'current'})`
);
console.log(`  cache policy: ${cachePolicyId} (${cacheChanged ? 'enable gzip/br' : 'current'})`);
console.log(
  `  error responses: ${distributionChanged ? '403/404 -> /404.html with status 404' : 'current'}`
);

if (!cspChanged && !cacheChanged && !distributionChanged) {
  console.log('No changes needed.');
  process.exit(0);
}

if (!apply) {
  console.log('Dry run only. Pass --apply to update CloudFront.');
  process.exit(0);
}

backup('distribution', distribution);
backup('response-headers-policy', headersPolicy);
backup('cache-policy', cachePolicy);

if (cspChanged) {
  applyAws([
    'cloudfront',
    'update-response-headers-policy',
    '--id',
    headersPolicyId,
    '--if-match',
    headersPolicy.ETag,
    '--response-headers-policy-config',
    writeTemp('response-headers-policy', headersConfig),
  ]);
}

if (cacheChanged) {
  applyAws([
    'cloudfront',
    'update-cache-policy',
    '--id',
    cachePolicyId,
    '--if-match',
    cachePolicy.ETag,
    '--cache-policy-config',
    writeTemp('cache-policy', cacheConfig),
  ]);
}

if (distributionChanged) {
  // Policy updates can bump the distribution ETag even when its config did not
  // change. Re-fetch before writing so the update uses the current ETag.
  const latest = aws([
    'cloudfront',
    'get-distribution',
    '--id',
    distributionId,
    '--output',
    'json',
  ]);
  const latestConfig = structuredClone(latest.Distribution.DistributionConfig);
  latestConfig.DefaultCacheBehavior.Compress = true;
  latestConfig.CustomErrorResponses = nextDistributionConfig.CustomErrorResponses;

  if (JSON.stringify(latestConfig) !== JSON.stringify(latest.Distribution.DistributionConfig)) {
    applyAws([
      'cloudfront',
      'update-distribution',
      '--id',
      distributionId,
      '--if-match',
      latest.ETag,
      '--distribution-config',
      writeTemp('distribution', latestConfig),
    ]);
    execFileSync('aws', ['cloudfront', 'wait', 'distribution-deployed', '--id', distributionId], {
      stdio: 'inherit',
    });
  }
}

console.log(`Applied. Backups: ${backupDir}`);
