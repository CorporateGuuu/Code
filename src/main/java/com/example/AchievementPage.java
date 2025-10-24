package com.example;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

import javafx.scene.layout.VBox;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import java.util.Arrays;
import java.util.List;

public class AchievementPage {
    private VBox view;

    private static class Achievement {
        String title, reward, rewardColor, timestamp, type;
        String proofImage;
        List<String> avatars; // placeholder, using strings for urls if needed

        Achievement(String title, String reward, String rewardColor, String proofImage, String timestamp, String type, List<String> avatars) {
            this.title = title;
            this.reward = reward;
            this.rewardColor = rewardColor;
            this.proofImage = proofImage;
            this.timestamp = timestamp;
            this.type = type;
            this.avatars = avatars;
        }
    }

    private List<Achievement> achievements = Arrays.asList(
            new Achievement("Won $20 Blackjack Dare", "+15", "#00D4AA",
                    "https://via.placeholder.com/200x100?text=Blackjack+Proof",
                    "03:08 PM EDT, Oct 17, 2025", "win", Arrays.asList(null, null, null)),
            new Achievement("Lost $5 Dice Roll", "-5", "#FF6666",
                    "https://via.placeholder.com/200x100?text=Dice+Proof",
                    "02:15 PM EDT, Oct 17, 2025", "loss", Arrays.asList(null, null, null)),
            new Achievement("Won $10 Rock Paper Scissors", "+20", "#00D4AA",
                    "https://via.placeholder.com/200x100?text=RPS+Proof",
                    "01:30 PM EDT, Oct 17, 2025", "win", Arrays.asList(null, null, null))
    );

    public AchievementPage() {
        createView();
    }

    public VBox getView() {
        return view;
    }

    private void createView() {
        view = new VBox(10);
        view.setPadding(new Insets(10));
        view.setAlignment(Pos.TOP_CENTER);

        // Header
        HBox header = new HBox(10);
        header.setAlignment(Pos.CENTER_LEFT);
        header.setStyle("-fx-background-color: #222222; -fx-padding: 12 16 12 16;");

        Label trophy = new Label("🏆");
        trophy.setTextFill(Color.GOLD);
        trophy.setFont(Font.font("System", FontWeight.BOLD, 24));

        Label title = new Label("Dare Results");
        title.setTextFill(Color.WHITE);
        title.setFont(Font.font("System", FontWeight.BOLD, 20));

        header.getChildren().addAll(trophy, title);

        // Scrollable Cards
        ScrollPane scrollPane = new ScrollPane();
        scrollPane.setFitToWidth(true);
        scrollPane.setVbarPolicy(ScrollPane.ScrollBarPolicy.AS_NEEDED);
        scrollPane.setStyle("-fx-background: #000000;");

        VBox cardsContainer = new VBox(10);
        cardsContainer.setPadding(new Insets(10, 0, 80, 0));

        for (Achievement ach : achievements) {
            cardsContainer.getChildren().add(createCard(ach));
        }

        scrollPane.setContent(cardsContainer);

        // Footer Button
        Button claimButton = new Button("Claim Reward");
        claimButton.setStyle("-fx-background-color: #00D4AA; -fx-text-fill: black; -fx-font-size: 14px; -fx-font-weight: 600;");
        claimButton.setPrefHeight(40);
        claimButton.setOnAction(e -> System.out.println("Claim reward pressed"));

        VBox footer = new VBox(claimButton);
        footer.setAlignment(Pos.CENTER);
        footer.setPadding(new Insets(16));

        view.getChildren().addAll(header, scrollPane, footer);
    }

    private VBox createCard(Achievement ach) {
        VBox card = new VBox(10);
        card.setStyle("-fx-background-color: #222222; -fx-border-color: #333333; -fx-border-width: 1; -fx-border-radius: 10; -fx-background-radius: 10;");
        card.setPadding(new Insets(16));
        card.setPrefWidth(360);

        // Title
        Label title = new Label(ach.title);
        title.setTextFill(Color.WHITE);
        title.setFont(Font.font("System", 16));

        // Type
        Label typeLabel = new Label("Type: " + ach.type.substring(0,1).toUpperCase() + ach.type.substring(1));
        typeLabel.setTextFill(Color.LIGHTGRAY);
        typeLabel.setFont(Font.font("System", 12));

        // Avatars
        HBox avatars = new HBox(8);
        for (int i = 0; i < 3; i++) {
            Circle avatar = new Circle(10, Color.LIGHTBLUE);
            avatar.setStroke(Color.web(ach.rewardColor));
            avatar.setStrokeWidth(2);
            avatars.getChildren().add(avatar);
        }

        // Reward Circle (top right)
        Circle rewardCircle = new Circle(15, Color.web(ach.rewardColor));
        Label rewardLabel = new Label(ach.reward);
        rewardLabel.setTextFill(Color.BLACK);
        rewardLabel.setFont(Font.font("System", FontWeight.BOLD, 12));
        StackPane rewardStack = new StackPane(rewardCircle, rewardLabel);

        // Overlay for reward
        StackPane cardContainer = new StackPane(card);
        rewardStack.setTranslateX(130); // Adjust position
        rewardStack.setTranslateY(-50);

        cardContainer.getChildren().add(rewardStack);

        // Proof Image
        ImageView proofImage = new ImageView(new Image(ach.proofImage, 350, 80, true, true));
        proofImage.setFitWidth(350);
        proofImage.setFitHeight(80);

        // Timestamp
        Label timestamp = new Label(ach.timestamp);
        timestamp.setTextFill(Color.LIGHTGRAY);
        timestamp.setFont(Font.font("System", 12));

        card.getChildren().addAll(title, typeLabel, avatars, proofImage, timestamp);

        return new VBox(cardContainer);
    }
}
