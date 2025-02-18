# Import certyfikatów do ACM
resource "aws_acm_certificate" "imported_cert" {
  private_key       = file("/home/ec2-user/environment/C9P2/cert/private.key")
  certificate_body  = file("/home/ec2-user/environment/C9P2/cert/certificate.crt")

  tags = {
    Name = "ImportedCert"
  }
}