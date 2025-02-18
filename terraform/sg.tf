# Tworzenie SG dla Appliaction load balancer

resource "aws_security_group" "alb_sg" {
  name = "alb_sg"
  vpc_id = aws_vpc.project.id
  tags = {
    Name = "ALB Security Group"
  }
}

# reguła ALB na ruch https
resource "aws_vpc_security_group_ingress_rule" "allow_https" {
  security_group_id = aws_security_group.alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  description       = "Allow HTTPS access to ALB"
  tags = {
    Name = "Allow HTTPS access"
  }
}
# EGRES dla alb
resource "aws_vpc_security_group_egress_rule" "allow_all_out" {
  security_group_id = aws_security_group.alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  tags = {
    Name = "Allow all traffic out"
  }
}
# SG RDS
resource "aws_security_group" "rds_db" {
  name = "rds_sg"
  vpc_id = aws_vpc.project.id

  tags = {
    Name = "RDS SG"
  }
}
# ingress dla bazy
resource "aws_vpc_security_group_ingress_rule" "allow_mysql_rds" {
  security_group_id = aws_security_group.rds_db.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 3306
  to_port           = 3306
  ip_protocol       = "tcp"
  description       = "Allow MySQL access to RDS"
  tags = {
    Name = "Allow MySQL access to RDS"
  }
}
# egress dla bazy
resource "aws_vpc_security_group_egress_rule" "allow_all_rds" {
  security_group_id = aws_security_group.rds_db.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  tags = {
    Name = "Allow all traffic out"
  }
}
# sg dla backendu
resource "aws_security_group" "ecs_backend_sg" {
  name   = "ecs_backend_sg"
  vpc_id = aws_vpc.project.id
  tags = {
    Name = "ECS Backend Security Group"
  }
}

resource "aws_security_group_rule" "backend_allow_alb" {
  type                     = "ingress"
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs_backend_sg.id
  source_security_group_id = aws_security_group.alb_sg.id
  description              = "Allow traffic from ALB to Backend"
}

resource "aws_vpc_security_group_egress_rule" "backend_allow_all_out" {
  security_group_id = aws_security_group.ecs_backend_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  tags = {
    Name = "Allow all traffic out from Backend"
  }
}

resource "aws_security_group" "ecs_frontend_sg" {
  name   = "ecs_frontend_sg"
  vpc_id = aws_vpc.project.id
  tags = {
    Name = "ECS Frontend Security Group"
  }
}

resource "aws_security_group_rule" "frontend_allow_alb" {
  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs_frontend_sg.id
  source_security_group_id = aws_security_group.alb_sg.id
  description              = "Allow traffic from ALB to Frontend"
}

resource "aws_vpc_security_group_egress_rule" "frontend_allow_all_out" {
  security_group_id = aws_security_group.ecs_frontend_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  tags = {
    Name = "Allow all traffic out from Frontend"
  }
}

resource "aws_security_group" "message_lambda_sg" {
  name        = "message_lambda_sg"
  description = "Security Group for Message Lambda"
  vpc_id      = aws_vpc.project.id
}

resource "aws_security_group_rule" "lambda_allow_all_out" {
  type              = "egress"
  from_port         = 3306
  to_port           = 3306
  protocol          = "-1"
  security_group_id = aws_security_group.message_lambda_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
}
