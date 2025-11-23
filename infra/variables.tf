variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "reservations-mvp"
}

variable "vpc_cidr" {
  type    = string
  default = "10.10.0.0/16"
}

variable "public_subnet_cidr" {
  type    = string
  default = "10.10.1.0/24"
}

variable "instance_type" {
  type    = string
  default = "t3.small"
}

variable "key_name" {
  type        = string
  description = "Existing AWS EC2 Key Pair name for SSH"
}

variable "repo_url" {
  type        = string
  description = "Git repo to clone on the instance (HTTPS). Example: https://github.com/you/reservations-mvp.git"
}

variable "repo_branch" {
  type    = string
  default = "main"
}

variable "app_env_file_ssm_param" {
  type        = string
  description = "Optional SSM parameter name holding your .env.prod content. If empty, you can scp it manually."
  default     = ""
}

variable "ssh_cidr" {
  type        = string
  description = "CIDR allowed to SSH, set to your IP/32"
  default     = "0.0.0.0/0"
}
