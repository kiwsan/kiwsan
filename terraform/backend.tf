terraform {
  backend "s3" {
    bucket       = "kiwsan-terraform-state-596990421883"
    key          = "kiwsan/terraform.tfstate"
    region       = "ap-southeast-1"
    use_lockfile = true
    encrypt      = true
  }
}
