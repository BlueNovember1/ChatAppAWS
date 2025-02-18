#Przypisanie podsieci publicznych do bazy RDS
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]

  tags = {
    Name = "RDS Subnet Group"
  }
}
# Baza danych
resource "aws_db_instance" "rds_db" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  db_name              = "chat_database"
  username             = "admin"
  password             = "dominik1"
  port                 = 3306
  publicly_accessible  = true
  vpc_security_group_ids = [
    aws_security_group.rds_db.id
  ]
  skip_final_snapshot  = true
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name

  tags = {
    Name = "RDS MySQL Server"
  }
}

output "rds_endpoint" {
  value = aws_db_instance.rds_db.endpoint
}