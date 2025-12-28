package com.ttsapp.controller;

import com.ttsapp.dto.VoiceDTO;
import com.ttsapp.service.VoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/voices")
@RequiredArgsConstructor
public class VoiceController {

    private final VoiceService voiceService;

    @GetMapping
    public ResponseEntity<List<VoiceDTO>> getAllVoices() {
        return ResponseEntity.ok(voiceService.getAllVoices());
    }

    @GetMapping("/{provider}")
    public ResponseEntity<List<VoiceDTO>> getVoicesByProvider(@PathVariable String provider) {
        return ResponseEntity.ok(voiceService.getVoicesByProvider(provider));
    }

    @GetMapping("/languages")
    public ResponseEntity<List<String>> getLanguages() {
        return ResponseEntity.ok(voiceService.getLanguages());
    }
}
