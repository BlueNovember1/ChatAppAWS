#TASK DEFINITION

# Definicja tasku ESC dla backendu
resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task-definition"
  cpu                      = "512"
  memory                   = "1024"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn = data.aws_iam_role.lab_role.arn
  task_role_arn = data.aws_iam_role.lab_role.arn
  
  # Definicja kontenera
  container_definitions = jsonencode([{
    name      = "backend-container"
    image     = var.docker_backend
    essential = true
# Mapowanie portów
    portMappings = [{
      containerPort = 8080
      hostPort      = 8080
      protocol      = "tcp"
    }]
 # Zmienne środowiskow
    environment = [
      {
        name  = "DATABASE"
        value = "${aws_db_instance.rds_db.endpoint}"
      },
      {
        name  = "AWS_REGION"
        value = var.region
      },
      {
        name  = "SQS_QUEUE_URL"
        value = aws_sqs_queue.my_queue.url
      }
    ]
  }])
  # zależy od bazy
  depends_on = [
    aws_db_instance.rds_db,
  ]
}

# Definicja zadania ECS dla Fronted
resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "frontend-task-definition"
  cpu                      = "512"
  memory                   = "1024"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn = data.aws_iam_role.lab_role.arn
  task_role_arn = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([{
    name      = "frontend-container"
    image     = var.docker_frontend
    essential = true
    
    portMappings = [{
      containerPort = 3000
      hostPort      = 3000
      protocol      = "tcp"
    }]
  }])
}
