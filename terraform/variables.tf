# No variables needed - using existing bucket

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for kiwsan.com (must be in us-east-1 for CloudFront)"
  type        = string
}
