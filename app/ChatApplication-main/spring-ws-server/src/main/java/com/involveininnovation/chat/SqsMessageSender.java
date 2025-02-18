package com.involveininnovation.chat;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.MessageAttributeValue;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class SqsMessageSender {

    private final SqsClient sqsClient;
    private final String queueUrl;

    public SqsMessageSender(SqsClient sqsClient, @Value("${aws.sqs.queue-url}") String queueUrl) {
        this.sqsClient = sqsClient;
        this.queueUrl = queueUrl;
    }

    public void sendMessage(String sender, String messageBody, String messageGroupId) {
        Map<String, MessageAttributeValue> messageAttributes = new HashMap<>();

        messageAttributes.put("sender", MessageAttributeValue.builder()
                .dataType("String")
                .stringValue(sender)
                .build());

        SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                .queueUrl(queueUrl)
                .messageBody(messageBody)
                .messageGroupId(messageGroupId)
                .messageDeduplicationId(UUID.randomUUID().toString())
                .messageAttributes(messageAttributes)
                .build();

        sqsClient.sendMessage(sendMessageRequest);
        System.out.println("Message sent to SQS: " + messageBody);
    }
}
