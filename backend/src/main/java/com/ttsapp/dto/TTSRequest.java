package com.ttsapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TTSRequest {
    @NotBlank
    @Size(max = 5000)
    private String text;

    @NotBlank
    private String provider; // "amazon", "google", "azure"

    private String voiceId;
    private String languageCode;
    private Float speakingRate;
    private Float pitch;
    private String audioQuality; // "low", "medium", "high"
}
