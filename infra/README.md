# AWS Terraform Baseline (VM/container deploy)

This provisions a minimal-cost MVP infra:
- 1 VPC with a public subnet
- Internet Gateway + route
- Security group allowing SSH + HTTP
- 1 EC2 instance running Docker
- User-data pulls your repo and runs docker-compose.prod.yml (app + Postgres on same box)

> This avoids managed DB costs for phase-1. You can later split DB to RDS or a separate EC2.

## Prereqs
- Terraform/OpenTofu installed
- AWS CLI configured (`aws configure`) with an IAM user that can create VPC/EC2/IAM
- An SSH keypair in your AWS account

## Usage

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# edit region, key_name, repo_url, etc.

terraform init
terraform plan
terraform apply
```

Outputs include instance public IP and app URL.

## After apply
SSH in:
```bash
ssh -i /path/to/key.pem ubuntu@<public_ip>
```

Logs:
```bash
docker ps
docker logs -f reservations_app
```

## Destroy
```bash
terraform destroy
```
