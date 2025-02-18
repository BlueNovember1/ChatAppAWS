# Tworzenie alarmu w CloudWatch 
resource "aws_cloudwatch_metric_alarm" "my_alarm" {
  alarm_name          = "HighSQSQueueDepth"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  dimensions = {
  # kolejka
    QueueName = aws_sqs_queue.my_queue.name
  }

  alarm_description = "Alarm when the number of visible messages in the queue exceeds the threshold."
  insufficient_data_actions = []
  alarm_actions = [aws_sns_topic.sns_topic.arn]
}

# Tworzenie powiadomienia w Simple Notification Service
resource "aws_sns_topic" "sns_topic" {
  name = "sqs-alerts-topic"
}

# Subskrybcja na email
resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.sns_topic.arn
  protocol  = "email"
  endpoint  = var.alarm_email
}