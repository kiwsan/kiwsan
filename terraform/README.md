# Terraform deployment

The site is uploaded to the existing S3 bucket and served by the existing CloudFront distribution. Terraform owns the S3 objects, their MIME types, and their cache headers. CloudFront security headers, compression, and the 404 response are applied by `scripts/apply-cloudfront.mjs`.

## Prerequisites

- AWS credentials for account `596990421883`
- Terraform 1.15 or newer
- A built `dist/` directory

## First-time state bootstrap

The state bucket already exists in this account. To recreate it on a fork, run:

```bash
./scripts/bootstrap-terraform-state.sh
```

The backend uses S3 native locking with `use_lockfile = true`. It does not require a DynamoDB table.

## Plan and apply

```bash
npm run build
cd terraform
terraform init
terraform plan
terraform apply
```

`terraform.tfvars` contains the region and bucket name. The CI passes the same values from GitHub secrets.

The state file lives at `s3://kiwsan-terraform-state-596990421883/kiwsan/terraform.tfstate`.

## CloudFront configuration

After the S3 upload, apply the response headers, cache policy, and error responses:

```bash
npm run cloudfront:plan
npm run cloudfront:apply
```

`cloudfront:plan` is a dry run. `cloudfront:apply` writes a backup to `.cloudfront/backups/` before changing anything.

The deploy workflow runs `cloudfront:apply` automatically after `terraform apply`.

## MIME types and caching

`main.tf` sets `Content-Type` and `Cache-Control` for each object:

- HTML: `public, max-age=0, must-revalidate`
- Hashed `_astro/` assets and images: `public, max-age=31536000, immutable`
- Everything else: `public, max-age=3600`

CloudFront compresses HTML, CSS, JavaScript, and SVG with gzip or Brotli.
