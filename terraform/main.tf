terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"
}

data "aws_s3_bucket" "website" {
  bucket = "kiwsan.com"
}

resource "aws_s3_object" "website_files" {
  for_each = fileset("${path.module}/../dist", "**/*")

  bucket        = data.aws_s3_bucket.website.id
  key           = each.value
  source        = "${path.module}/../dist/${each.value}"
  etag          = filemd5("${path.module}/../dist/${each.value}")
  content_type  = lookup(local.mime_types, regex("\\.[^.]+$", each.value), "application/octet-stream")
  cache_control = contains(local.immutable_extensions, regex("\\.[^.]+$", each.value)) && startswith(each.value, "_astro/") ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate"
}

resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "kiwsan-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = ["kiwsan.com", "www.kiwsan.com"]
  http_version        = "http2and3"
  price_class         = "PriceClass_All"

  origin {
    domain_name              = data.aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "s3-kiwsan"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-kiwsan"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 0      # honour Cache-Control from S3 objects
    max_ttl     = 31536000
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }
}

data "aws_iam_policy_document" "cloudfront_oac" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${data.aws_s3_bucket.website.arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.website.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "website" {
  bucket = data.aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.cloudfront_oac.json
}

locals {
  mime_types = {
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain"
  }

  # Immutable hashed assets (Astro fingerprints _astro/* files)
  immutable_extensions = toset([".js", ".css", ".woff", ".woff2"])
}
