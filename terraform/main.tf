terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_s3_bucket" "website" {
  bucket = var.bucket_name
}

locals {
  mime_types = {
    ".html"        = "text/html; charset=utf-8"
    ".css"         = "text/css; charset=utf-8"
    ".js"          = "application/javascript; charset=utf-8"
    ".mjs"         = "application/javascript; charset=utf-8"
    ".json"        = "application/json"
    ".xml"         = "application/xml"
    ".txt"         = "text/plain; charset=utf-8"
    ".webmanifest" = "application/manifest+json"
    ".png"         = "image/png"
    ".jpg"         = "image/jpeg"
    ".jpeg"        = "image/jpeg"
    ".svg"         = "image/svg+xml"
    ".ico"         = "image/x-icon"
    ".webp"        = "image/webp"
    ".avif"        = "image/avif"
    ".woff"        = "font/woff"
    ".woff2"       = "font/woff2"
    ".map"         = "application/json"
  }
}

resource "aws_s3_object" "website_files" {
  for_each = fileset("${path.module}/../dist", "**/*")

  bucket       = data.aws_s3_bucket.website.id
  key          = each.value
  source       = "${path.module}/../dist/${each.value}"
  etag         = filemd5("${path.module}/../dist/${each.value}")
  content_type = lookup(local.mime_types, try(regex("\\.[^.]+$", each.value), ""), "application/octet-stream")

  cache_control = (
    endswith(each.value, ".html")
    ? "public, max-age=0, must-revalidate"
    : startswith(each.value, "_astro/")
    ? "public, max-age=31536000, immutable"
    : can(regex("^images/(og-image|social/)", each.value))
    ? "public, max-age=300"
    : can(regex("\\.(png|jpg|jpeg|svg|webp|avif|ico|woff2?)$", each.value))
    ? "public, max-age=31536000, immutable"
    : "public, max-age=3600"
  )
}
