package com.ttsapp.service;

import com.ttsapp.dto.VoiceDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VoiceService {

    private final List<VoiceDTO> voices;

    public VoiceService() {
        this.voices = new ArrayList<>();
        // Mock data for Amazon Polly
        voices.add(new VoiceDTO("Joanna", "Joanna", "en-US", "FEMALE", "amazon", List.of("neural", "standard"), null));
        voices.add(new VoiceDTO("Matthew", "Matthew", "en-US", "MALE", "amazon", List.of("neural", "standard"), null));
        
        // Mock data for Google Cloud TTS
        voices.add(new VoiceDTO("en-US-Wavenet-A", "Wavenet-A", "en-US", "FEMALE", "google", List.of("wavenet"), null));
        voices.add(new VoiceDTO("en-US-Wavenet-B", "Wavenet-B", "en-US", "MALE", "google", List.of("wavenet"), null));
        
        // Mock data for Azure
        voices.add(new VoiceDTO("en-US-JennyNeural", "Jenny", "en-US", "FEMALE", "azure", List.of("neural"), null));
        voices.add(new VoiceDTO("en-US-GuyNeural", "Guy", "en-US", "MALE", "azure", List.of("neural"), null));
    }

    public List<VoiceDTO> getAllVoices() {
        return voices;
    }

    public List<VoiceDTO> getVoicesByProvider(String provider) {
        return voices.stream()
                .filter(v -> v.getProvider().equalsIgnoreCase(provider))
                .collect(Collectors.toList());
    }

    public List<String> getLanguages() {
        return voices.stream()
                .map(VoiceDTO::getLanguageCode)
                .distinct()
                .collect(Collectors.toList());
    }
}
