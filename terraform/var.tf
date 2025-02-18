variable "region" {
  type    = string
  default = "us-east-1"
}

variable "queue_name" {
  type    = string
  default = "my-queue.fifo"
}

variable "docker_backend" {
  type    = string
  default = "222579201691.dkr.ecr.us-east-1.amazonaws.com/backend:latest"
}

variable "docker_frontend" {
  type    = string
  default = "222579201691.dkr.ecr.us-east-1.amazonaws.com/frontend:latest"
}

variable "alarm_email" {
  type    = string
  default = "mymail"
}

variable "message_lambda_admin_email" {
  type    = string
  default = "mymail"
}