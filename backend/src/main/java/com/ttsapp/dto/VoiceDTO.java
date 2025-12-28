package com.ttsapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoiceDTO {
    private String id;
    private String name;
    private String languageCode;
    private String gender; // MALE, FEMALE, NEUTRAL
    private String provider; // amazon, google, azure
    private List<String> styles; // e.g., neural, standard
    private String sampleUrl;
}
