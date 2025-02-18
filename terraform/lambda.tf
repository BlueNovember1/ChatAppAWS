# Tworzenie labdy 
resource "aws_lambda_function" "message_lambda" {
  function_name = "message_lambda"

  filename      = "/home/ec2-user/environment/C9P2/lambda/target/lambda-1.0-SNAPSHOT.jar"
  runtime       = "java17"
  role          = data.aws_iam_role.lab_role.arn
  handler       = "com.example.MessageLambda::handleRequest"
  memory_size   = 256
  timeout       = 60 # zabija lambde

  publish = true  
  
  # Zmienne które lambda używa
  environment {
    variables = {
      ADMIN_EMAIL = var.message_lambda_admin_email
      DB_HOST = "${aws_db_instance.rds_db.endpoint}"
    }
  }
  # siec
  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]  
    security_group_ids = [aws_security_group.message_lambda_sg.id]  
  }
}
#Tworzy alias dla funkcji Lambda, który wskazuje na wersję prod
resource "aws_lambda_alias" "message_lambda_alias" {
  name             = "prod"  
  function_name    = aws_lambda_function.message_lambda.function_name
  function_version = aws_lambda_function.message_lambda.version
}
# Ustawia provisioned concurrency dla aliasu Lambda
resource "aws_lambda_provisioned_concurrency_config" "provisioned_concurrency" {
  function_name                    = aws_lambda_function.message_lambda.function_name
  qualifier                        = aws_lambda_alias.message_lambda_alias.name
  provisioned_concurrent_executions = 2        
}
# Mapowanie źródła zdarzeń z kolejki SQS do funkcji Lambda
resource "aws_lambda_event_source_mapping" "event_source_mapping" {
  function_name     = aws_lambda_function.message_lambda.arn
  event_source_arn  = aws_sqs_queue.my_queue.arn
  batch_size        = 1 
  enabled           = true
}
