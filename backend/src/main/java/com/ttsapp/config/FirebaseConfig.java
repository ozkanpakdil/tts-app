package com.ttsapp.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.config.path:}")
    private String firebaseConfigPath;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseOptions options;
                if (firebaseConfigPath != null && !firebaseConfigPath.isEmpty()) {
                    FileInputStream serviceAccount = new FileInputStream(firebaseConfigPath);
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                } else {
                    // Try to use Google Application Default Credentials
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.getApplicationDefault())
                            .build();
                }
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            // Log error but don't fail startup if firebase not configured yet
            System.err.println("Firebase initialization failed: " + e.getMessage());
        }
    }
}
