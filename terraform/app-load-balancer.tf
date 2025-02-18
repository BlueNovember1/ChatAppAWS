#Tworzenie Application Load Balancer, 
resource "aws_lb" "alb" {
  name               = "alb"
  internal           = false # publiczny
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  enable_deletion_protection = false
  enable_cross_zone_load_balancing = true
#łączenie z publicznymi siecaimi
  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]
  
  tags = {
    Name = "My Application Load Balancer"
  }
}
# listener z certyfikatem ACM
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"

  certificate_arn = aws_acm_certificate.imported_cert.arn
  # Przekazanie ruchu do grupy 
  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.frontend_target_group.arn
  }
}
# Reguła która przekierowuje ruch z api do backendu
resource "aws_lb_listener_rule" "api_backend_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}
# ws do backend
resource "aws_lb_listener_rule" "ws_backend_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 2

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/ws/*"]
    }
  }
}
# grupa docelowa backendu
resource "aws_lb_target_group" "backend_target_group" {
  name     = "backend-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = aws_vpc.project.id
  target_type = "ip"
  
  health_check {
    path                = "/api/health-check"
    interval            = 60
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }

  tags = {
    Name = "backend-target-group"
  }
}
# Grupa docelowa dla frontendu
resource "aws_lb_target_group" "frontend_target_group" {
  name     = "frontend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.project.id
  target_type = "ip"
  
  tags = {
    Name = "frontend-target-group"
  }
}

output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}