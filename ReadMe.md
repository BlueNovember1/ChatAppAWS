# Description
From class "Zastosowanie rozwiązań chmurowych w aplikacjach webowych"
## 1. Deploy the application from Project 1 using AWS Beanstalk or AWS Fargate:
- Ensure that the application is configured in such a way that the frontend and backend can scale independently.

## 2. Add message analysis capability or its equivalent:
- Create an SQS queue where all sent messages will be stored.
- Create a Lambda function that will implement the following logic:
    - Introduce a 5-second delay in processing each message.
    - If the message content contains a number, send a copy of the message to a user account named **"admin"**.
    - Implement the following constraints:
        1. A single Lambda instance should process a maximum of one message at a time.
        2. A maximum of two Lambda instances can run concurrently.

## 3. Configure CloudWatch and define an alarm:
- Create a custom CloudWatch alarm that will be triggered based on a criterion of your choice (e.g., exceeding the number of pending messages in the SQS queue or an excessive number of concurrent Lambda instances).

## 4. Configure CloudTrail and check the event history:
- Enable CloudTrail for your AWS account to log all API operations.
- Review the event history in CloudTrail to verify the correct operation of your application and other AWS resources.

## 5. Prepare the entire project configuration in Terraform.

---
# Project Structure 

## 📁 `app`
- This folder contains chat application in the main application, which consists of a separate backend (Spring Boot) and frontend (React).
- The application has been deployed and can be accessed at: **https://www.youtube.com/watch?v=o_IjEDAuo8Y**

## 📁 `cert`
- Stores certificates used for HTTPS encryption.
- Contains a private key for secure communication.

## 📁 `docker`
- Holds Docker images used to build virtual instances for AWS Fargate.

## 📁 `lambda`
- Contains code for AWS Lambda, generated in Java with Maven (`pom.xml`).

## 📁 `terraform`
- Defines the infrastructure as code, provisioning the entire environment using Terraform.
---
# Solution

- **Terraform** – Automates infrastructure deployment and management using Infrastructure as Code (IaC).
- **AWS Fargate** – Manages containerized applications (using docker images) without the need to provision or manage servers.
- **AWS Lambda** – Executes serverless functions for event-driven processing and analyzing messages in SQS.
- **Amazon SQS (Simple Queue Service)** – Provides a scalable message queuing system to decouple application components.
- **Amazon CloudWatch** – Monitors logs, metrics, and application performance, enabling automated alarms (in this case after 10 messages in 1 minute admin account gets a notification e-mail).
- **AWS CloudTrail** – Logs and tracks API activity across AWS services for auditing and security analysis.
- **Amazon VPC (Virtual Private Cloud)** – Provides an isolated network environment for securely running AWS resources (private for cluster, public for RDS).
- **Amazon RDS (Relational Database Service)** – Manages a scalable relational database (MySQL) for storing application messages with numbers. 
- **Amazon ECS Cluster** – Orchestrates and manages containerized workloads using AWS Fargate.
- **Amazon ECS Service** – Ensures the desired number of running container instances for the deployed application (in this after CP goes above up/down 60 % for 5 minutes autoscaling is implemented and additional container is added/deleted).

