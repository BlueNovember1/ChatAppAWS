#Tworzenie Elastic IP, który przypisujemy do NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "nat-eip"
  }
}

#Tworzenie NAT Gateway - umożliwienie podsieci prywatnej dostępu do Internetu (tylko w jedną stronę)
resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id

  tags = {
    Name = "project-nat-gateway"
  }
}


# Tworzenie VPC
resource "aws_vpc" "project" {
  cidr_block           = "10.0.0.0/16"
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "project-vpc"
  }
}

# Tworzenie podsieci publicznych
resource "aws_subnet" "public_a" {
  vpc_id            = aws_vpc.project.id
  cidr_block        = "10.0.0.0/20"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "project-subnet-public1-us-east-1a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id            = aws_vpc.project.id
  cidr_block        = "10.0.16.0/20"
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "project-subnet-public2-us-east-1b"
  }
}

# Tworzenie podsieci prywatnych
resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.project.id
  cidr_block        = "10.0.128.0/20"
  availability_zone = "us-east-1a"

  tags = {
    Name = "project-subnet-private1-us-east-1a"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.project.id
  cidr_block        = "10.0.144.0/20"
  availability_zone = "us-east-1b"

  tags = {
    Name = "project-subnet-private2-us-east-1b"
  }
}

# Tworzenie Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.project.id

  tags = {
    Name = "project-igw"
  }
}

# Tworzenie tablic routingu dla publicznych podsieci
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.project.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "project-rtb-public"
  }
}

# Przypisywanie podsieci publicznych do tablicy routingu
resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

# Tworzenie dwóch tablic routingu, jedna dla każdej prywatnej podsieci
resource "aws_route_table" "private_a" {
  vpc_id = aws_vpc.project.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat_gateway.id
  }

  tags = {
    Name = "project-rtb-private1-us-east-1a"
  }
}

resource "aws_route_table" "private_b" {
  vpc_id = aws_vpc.project.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat_gateway.id
  }

  tags = {
    Name = "project-rtb-private2-us-east-1b"
  }
}

# Przypisywanie prywatnych podsieci do różnych tablic routingu
resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private_a.id
}

resource "aws_route_table_association" "private_b" {
  subnet_id      = aws_subnet.private_b.id
  route_table_id = aws_route_table.private_b.id
}
