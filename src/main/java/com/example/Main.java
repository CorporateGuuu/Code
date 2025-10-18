package com.example;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    @Override
    public void start(Stage primaryStage) throws Exception {
        AchievementPage page = new AchievementPage();
        Scene scene = new Scene(page.getView(), 400, 600);

        primaryStage.setTitle("Harco Achievement");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
