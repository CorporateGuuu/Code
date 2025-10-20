package com.example;

import javafx.animation.*;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.stage.FileChooser;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.text.Font;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.effect.DropShadow;
import javafx.scene.effect.InnerShadow;
import javafx.util.Duration;

// Data models matching frontend/backend structure
class Dare {
    String id, title, creatorId, status;
    String[] participants;
    java.time.LocalDateTime deadline;
    int entryStake;
    String winnerId;

    Dare(String id, String title, String creatorId, String status, String[] participants, java.time.LocalDateTime deadline, int entryStake, String winnerId) {
        this.id = id;
        this.title = title;
        this.creatorId = creatorId;
        this.status = status;
        this.participants = participants != null ? participants : new String[0];
        this.deadline = deadline;
        this.entryStake = entryStake;
        this.winnerId = winnerId;
    }

    boolean isExpired() {
        return deadline != null && java.time.LocalDateTime.now().isAfter(deadline);
    }

    String getStatusColor() {
        switch (status) {
            case "open": return "#3B82F6"; // blue
            case "active": return "#F59E0B"; // yellow
            case "completed": return "#10B981"; // green
            case "cancelled": return "#EF4444"; // red
            default: return "#6B7280"; // gray
        }
    }
}

class DareService {
    private static java.util.List<Dare> mockDares = java.util.Arrays.asList(
        new Dare("dare-1", "The Kings will be better than the Bulls this season", "user1", "completed", new String[]{"user1", "user2"}, null, 20, "user1"),
        new Dare("dare-2", "Bitcoin will not reach $110,000", "user2", "completed", new String[]{"user2", "user3"}, null, 5, "user3"),
        new Dare("dare-3", "Bitcoin will not reach $110,000", "user2", "completed", new String[]{"user4", "user5"}, null, 15, null)
    );

    static java.util.List<Dare> getCompletedDares() {
        return mockDares.stream()
            .filter(dare -> "completed".equals(dare.status))
            .collect(java.util.stream.Collectors.toList());
    }

    static String[] getParticipantsForDare(Dare dare) {
        return dare.participants;
    }
}

public class InteractiveDareCards extends Application {

    private double startX, dragDeltaX, startRotate, startScale;

    @Override
    public void start(Stage primaryStage) {
        // Root layout with scroll
        ScrollPane scrollPane = new ScrollPane();
        scrollPane.setFitToWidth(true);
        scrollPane.setStyle("-fx-background: #000000; -fx-border-color: transparent;");

        VBox root = new VBox(10);
        root.setPadding(new Insets(10));
        root.setStyle("-fx-background-color: #000000;");
        scrollPane.setContent(root);

        // Get completed dares from service (matching frontend backend patterns)
        java.util.List<Dare> completedDares = DareService.getCompletedDares();

        // Add dare cards dynamically from data (matching frontend React patterns)
        for (Dare dare : completedDares) {
            addDareCard(root, dare);
        }

        // Scene and Stage
        Scene scene = new Scene(scrollPane, 390, 844);
        primaryStage.setTitle("Dare Cards");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private void addDareCard(VBox parent, Dare dare) {
        VBox card = new VBox(5);
        card.setPrefSize(350, 150);
        card.setStyle("-fx-background-color: #222222; -fx-border-color: #333333; -fx-border-width: 1; -fx-border-radius: 10; -fx-padding: 10;");

        // Title
        Label cardTitle = new Label(dare.title);
        cardTitle.setFont(Font.font("Montserrat", 16));
        cardTitle.setTextFill(Color.WHITE);

        // Participants (dynamic based on dare data)
        HBox userRow = new HBox(10);
        userRow.setAlignment(Pos.CENTER);
        String[] participants = DareService.getParticipantsForDare(dare);
        for (int i = 0; i < Math.min(participants.length, 3); i++) {
            Circle avatar = new Circle(15, Color.web("#333333"));
            avatar.setStroke(Color.web(dare.getStatusColor()));
            avatar.setStrokeWidth(2);
            Label usernameLabel = new Label("@" + participants[i]);
            usernameLabel.setTextFill(Color.LIGHTGRAY);
            userRow.getChildren().addAll(usernameLabel, avatar);
        }

        // Status indicator using dare status
        Label statusLabel = new Label(dare.status.toUpperCase());
        statusLabel.setTextFill(Color.web(dare.getStatusColor()));
        statusLabel.setFont(Font.font("Montserrat", 12));

        // Icons Row
        HBox iconsRow = new HBox(20);
        iconsRow.setAlignment(Pos.CENTER);
        Label[] iconLabels = {
            new Label("▶"), new Label("•••"), new Label("✖"), new Label("▶")
        };
        for (Label iconLabel : iconLabels) {
            iconLabel.setFont(Font.font(18));
            iconLabel.setTextFill(Color.WHITE);
        }
        iconsRow.getChildren().addAll(iconLabels);

        // Result based on winner (matching frontend logic)
        boolean isWinner = dare.winnerId != null &&
                          dare.participants != null &&
                          java.util.Arrays.asList(dare.participants).contains(dare.winnerId);

        String resultText = isWinner ? "You Won" : "You Lost";
        Color resultColor = isWinner ? Color.web("#00D4AA") : Color.web("#FF6666");

        Label resultLabel = new Label(resultText);
        resultLabel.setFont(Font.font("Montserrat", 14));
        resultLabel.setTextFill(resultColor);

        // Action Button (dynamic based on result)
        String actionText = isWinner ? "Post" : "Add Proof";
        Button actionButton = new Button(actionText);
        actionButton.setStyle("-fx-background-color: " + toRgbString(resultColor) + "; -fx-text-fill: #000000; -fx-font-size: 14px; -fx-padding: 5 20; -fx-border-radius: 10;");

        // Hover Animation (Scale Up)
        ScaleTransition hoverTransition = new ScaleTransition(Duration.millis(200), actionButton);
        hoverTransition.setToX(1.1);
        hoverTransition.setToY(1.1);
        actionButton.setOnMouseEntered(e -> hoverTransition.play());
        actionButton.setOnMouseExited(e -> {
            hoverTransition.setToX(1.0);
            hoverTransition.setToY(1.0);
            hoverTransition.play();
        });

        // Click Animation (Pulse)
        Timeline pulseTimeline = new Timeline(
            new KeyFrame(Duration.ZERO, new KeyValue(actionButton.styleProperty(), "-fx-background-color: " + toRgbString(resultColor))),
            new KeyFrame(Duration.millis(150), new KeyValue(actionButton.styleProperty(), "-fx-background-color: " + toRgbString(Color.web("#FFFFFF")))),
            new KeyFrame(Duration.millis(300), new KeyValue(actionButton.styleProperty(), "-fx-background-color: " + toRgbString(resultColor)))
        );
        pulseTimeline.setCycleCount(2);
        actionButton.setOnMousePressed(e -> pulseTimeline.play());
        actionButton.setOnMouseReleased(e -> actionButton.setStyle("-fx-background-color: " + toRgbString(resultColor) + "; -fx-text-fill: #000000; -fx-font-size: 14px; -fx-padding: 5 20; -fx-border-radius: 10;"));

        // Interactive Actions
        actionButton.setOnAction(event -> {
            if (actionText.equals("Post")) {
                Alert alert = new Alert(Alert.AlertType.INFORMATION);
                alert.setTitle("Post Action");
                alert.setContentText("Posting your win!");
                alert.showAndWait();
            } else if (actionText.equals("Add Proof")) {
                FileChooser fileChooser = new FileChooser();
                fileChooser.setTitle("Add Proof");
                fileChooser.showOpenDialog(actionButton.getScene().getWindow());
            }
        });

        // Add card content
        card.getChildren().addAll(cardTitle, userRow, iconsRow, resultLabel, actionButton);

        // Initial effects: shadow and glow
        DropShadow shadow = new DropShadow(5, Color.web("#00D4AA"));
        InnerShadow glow = new InnerShadow(5, Color.web("#00D4AA"));
        card.setEffect(new javafx.scene.effect.Effect[] {shadow, glow}[0]); // Start with shadow only

        // Swipe, Rotation, Scale, Opacity, Shadow, and Glow Animation
        card.setOnMousePressed(e -> {
            startX = e.getSceneX();
            dragDeltaX = card.getTranslateX();
            startRotate = card.getRotate();
            startScale = card.getScaleX();
            card.setOpacity(1.0); // Reset opacity on press
            shadow.setRadius(5); // Reset shadow radius
            shadow.setOffsetX(0);
            shadow.setOffsetY(0);
            glow.setRadius(5); // Reset glow radius
        });

        card.setOnMouseDragged(e -> {
            double deltaX = e.getSceneX() - startX;
            card.setTranslateX(dragDeltaX + deltaX);
            // Optimized rotation sensitivity with quadratic scaling
            double rotateAngle = (deltaX * deltaX) / 5000;
            if (deltaX < 0) rotateAngle = -rotateAngle;
            if (rotateAngle > 15) rotateAngle = 15;
            if (rotateAngle < -15) rotateAngle = -15;
            card.setRotate(startRotate + rotateAngle);
            // Scale animation based on swipe distance
            double scaleFactor = 1.0 + Math.abs(deltaX) / 700;
            if (scaleFactor > 1.2) scaleFactor = 1.2;
            card.setScaleX(startScale * scaleFactor);
            card.setScaleY(startScale * scaleFactor);
            // Opacity fade based on swipe distance
            double opacity = 1.0 - Math.abs(deltaX) / 400;
            if (opacity < 0.3) opacity = 0.3;
            card.setOpacity(opacity);
            // Shadow effect based on swipe distance
            double shadowRadius = 5 + Math.abs(deltaX) / 50; // Max radius 10 at 250px
            if (shadowRadius > 15) shadowRadius = 15;
            shadow.setRadius(shadowRadius);
            shadow.setOffsetX(deltaX / 20); // Slight offset in swipe direction
            shadow.setOffsetY(5);
            // Glow effect based on swipe distance
            double glowRadius = 5 + Math.abs(deltaX) / 30; // Max radius 15 at 300px
            if (glowRadius > 15) glowRadius = 15;
            glow.setRadius(glowRadius);
            card.setEffect(new javafx.scene.effect.Effect[] {shadow, glow}[1]); // Switch to glow during drag
        });

        card.setOnMouseReleased(e -> {
            double translateX = card.getTranslateX();
            TranslateTransition translateTransition = new TranslateTransition(Duration.millis(300), card);
            RotateTransition rotateTransition = new RotateTransition(Duration.millis(300), card);
            ScaleTransition scaleTransition = new ScaleTransition(Duration.millis(300), card);
            FadeTransition fadeTransition = new FadeTransition(Duration.millis(300), card);
            translateTransition.setInterpolator(Interpolator.EASE_OUT);
            rotateTransition.setInterpolator(Interpolator.EASE_OUT);
            scaleTransition.setInterpolator(Interpolator.EASE_OUT);
            fadeTransition.setInterpolator(Interpolator.EASE_OUT);

            if (translateX > 100) {
                // Swipe Right (e.g., Approve)
                translateTransition.setToX(400);
                rotateTransition.setToAngle(15);
                scaleTransition.setToX(1.0);
                scaleTransition.setToY(1.0);
                fadeTransition.setToValue(0.0); // Full fade-out
                translateTransition.setOnFinished(event -> parent.getChildren().remove(card));
                Alert alert = new Alert(Alert.AlertType.INFORMATION);
                alert.setTitle("Action");
                alert.setContentText("Dare Approved!");
                alert.showAndWait();
            } else if (translateX < -100) {
                // Swipe Left (e.g., Decline)
                translateTransition.setToX(-400);
                rotateTransition.setToAngle(-15);
                scaleTransition.setToX(1.0);
                scaleTransition.setToY(1.0);
                fadeTransition.setToValue(0.0); // Full fade-out
                translateTransition.setOnFinished(event -> parent.getChildren().remove(card));
                Alert alert = new Alert(Alert.AlertType.INFORMATION);
                alert.setTitle("Action");
                alert.setContentText("Dare Declined!");
                alert.showAndWait();
            } else {
                // Reset to original position, rotation, scale, opacity, shadow, and glow
                translateTransition.setToX(0);
                rotateTransition.setToAngle(0);
                scaleTransition.setToX(1.0);
                scaleTransition.setToY(1.0);
                fadeTransition.setToValue(1.0);
                shadow.setRadius(5);
                shadow.setOffsetX(0);
                shadow.setOffsetY(0);
                glow.setRadius(5);
                card.setEffect(shadow); // Revert to shadow only
            }
            translateTransition.play();
            rotateTransition.play();
            scaleTransition.play();
            fadeTransition.play();
        });

        parent.getChildren().add(card);
    }

    private String toRgbString(Color color) {
        return String.format("rgb(%.0f, %.0f, %.0f)", color.getRed() * 255, color.getGreen() * 255, color.getBlue() * 255);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
