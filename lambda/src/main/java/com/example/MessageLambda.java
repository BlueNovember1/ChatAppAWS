package com.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.regex.Pattern;

public class MessageLambda implements RequestHandler<SQSEvent, Void> {

    private static final String ADMIN_EMAIL = System.getenv("ADMIN_EMAIL");
    private static final String DB_HOST = System.getenv("DB_HOST");
    private static final String DB_NAME = "chat_database";
    private static final String DB_USERNAME = "admin";
    private static final String DB_PASSWORD = "dominik1";
    private static final Pattern DIGIT_PATTERN = Pattern.compile("\\d+");

    private static String constructJdbcUrl() {
        return String.format("jdbc:mysql://%s/%s", DB_HOST, DB_NAME);
    }

    @Override
    public Void handleRequest(SQSEvent event, Context context) {

        String databaseUrl = constructJdbcUrl();

        try (Connection dbConnection = DriverManager.getConnection(databaseUrl, DB_USERNAME, DB_PASSWORD)) {
            for (SQSEvent.SQSMessage message : event.getRecords()) {
                try {
                    Thread.sleep(5000);

                    String messageContent = message.getBody();

                    if (DIGIT_PATTERN.matcher(messageContent).find()) {
                        String senderEmail = message.getMessageAttributes().get("sender").getStringValue();
                        Long senderId = getUserIdByEmail(dbConnection, senderEmail);
                        Long adminId = getUserIdByEmail(dbConnection, ADMIN_EMAIL);

                        storeMessage(dbConnection, messageContent, senderId, adminId);
                        context.getLogger().log("Administrator został powiadomiony o wiadomości: " + messageContent);
                    }
                } catch (Exception processingException) {
                    context.getLogger().log("Błąd podczas przetwarzania wiadomości: " + processingException.getMessage());
                }
            }
        } catch (Exception dbException) {
            context.getLogger().log("Błąd połączenia z bazą danych: " + dbException.getMessage());
        }

        return null;
    }

    private Long getUserIdByEmail(Connection connection, String email) throws Exception {
        String query = "SELECT id FROM users WHERE email = ?";
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, email);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return resultSet.getLong("id");
                }
            }
        }
        throw new RuntimeException("Nie znaleziono użytkownika o podanym adresie e-mail.");
    }

    private void storeMessage(Connection connection, String content, Long senderId, Long adminId) throws Exception {
        String insertQuery = "INSERT INTO copied_messages (content, sender_id, user_id) VALUES (?, ?, ?)";
        try (PreparedStatement insertStatement = connection.prepareStatement(insertQuery)) {
            insertStatement.setString(1, content);
            insertStatement.setObject(2, senderId);
            insertStatement.setObject(3, adminId);
            insertStatement.executeUpdate();
        }
    }
}
