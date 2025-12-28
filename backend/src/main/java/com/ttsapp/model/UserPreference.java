package com.ttsapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "user_preferences")
@Data
public class UserPreference {
    @Id
    private Long userId;

    private String language = "en-US";
    private String voiceId;
    private Double rate = 0.5;
    private Double pitch = 1.0;
    private Boolean darkMode = false;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
}
