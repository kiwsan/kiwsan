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

resource "aws_s3_object" "website_files" {
  for_each = fileset("${path.module}/../dist", "**/*")

  bucket       = data.aws_s3_bucket.website.id
  key          = each.value
  source       = "${path.module}/../dist/${each.value}"
  etag         = filemd5("${path.module}/../dist/${each.value}")
  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), "application/octet-stream")
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
}
