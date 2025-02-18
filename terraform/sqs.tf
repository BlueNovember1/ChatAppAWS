# Tworzenie kolejki SQS w trybie fifo
resource "aws_sqs_queue" "my_queue" {
  name                        = var.queue_name
  fifo_queue                  = true
  content_based_deduplication = false
  visibility_timeout_seconds   = 120
}
# wyjscie url do kolejki
output "sqs_queue_url" {
  value = aws_sqs_queue.my_queue.url
}
