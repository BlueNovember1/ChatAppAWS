# Tworzenie grupę logów w CloudWatch do przechowywania logów z AWS CloudTrail
resource "aws_cloudwatch_log_group" "cloudtrail_log_group" {
  name              = "/aws/cloudtrail/my-cloudtrail-log-group"
  retention_in_days = 14
}

# Tworzy CloudTrail do monitorowania i audytowania
resource "aws_cloudtrail" "cloudtrail" {
  name                          = "cloudtrail"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_bucket.bucket
  is_multi_region_trail         = true
  enable_log_file_validation    = true
  include_global_service_events = true

  # Integracja z CloudWatch do wysyłania logów
  cloud_watch_logs_role_arn = data.aws_iam_role.lab_role.arn
  cloud_watch_logs_group_arn = "${aws_cloudwatch_log_group.cloudtrail_log_group.arn}:*"
  
  depends_on = [aws_s3_bucket_policy.cloudtrail_bucket_policy]
}


#Hosting S3 do logów
resource "aws_s3_bucket" "cloudtrail_bucket" {
  bucket = "cloudtrail-logs-bucket-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "cloudtrail_versioning" {
  bucket = aws_s3_bucket.cloudtrail_bucket.id
  
  versioning_configuration {
    status = "Enabled"
  }
}
# polityka S3 aby odbył się zapis logów CT do bucketu
resource "aws_s3_bucket_policy" "cloudtrail_bucket_policy" {
  bucket = aws_s3_bucket.cloudtrail_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
      # Umożliwia CloudTrail sprawdzenie ACL bucketu
        Sid = "AWSCloudTrailAclCheck20150319",
        Effect = "Allow",
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        },
        Action = "s3:GetBucketAcl",
        Resource = "${aws_s3_bucket.cloudtrail_bucket.arn}",
        Condition = {
          StringEquals = {
            "aws:SourceArn": "arn:aws:cloudtrail:${var.region}:${data.aws_caller_identity.current.account_id}:trail/cloudtrail"
          }
        }
      },
      {
      # Zapis logów
        Sid = "AWSCloudTrailWrite20150319",
        Effect = "Allow",
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        },
        Action = "s3:PutObject",
        Resource = "${aws_s3_bucket.cloudtrail_bucket.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/*",
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control",
            "aws:SourceArn": "arn:aws:cloudtrail:${var.region}:${data.aws_caller_identity.current.account_id}:trail/cloudtrail"
          }
        }
      }
    ]
  })
}