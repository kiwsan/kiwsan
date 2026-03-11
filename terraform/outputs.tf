output "bucket_name" {
  description = "S3 bucket name"
  value       = data.aws_s3_bucket.website.id
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = aws_cloudfront_distribution.website.domain_name
}
