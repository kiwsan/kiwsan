# Terraform Deployment

## วิธี Deploy

1. Build project:
```bash
npm run build
```

2. Initialize Terraform:
```bash
cd terraform
terraform init
```

3. Deploy:
```bash
terraform apply
```

4. ดู URL:
```bash
terraform output website_url
```

## ลบ Resources
```bash
terraform destroy
```
