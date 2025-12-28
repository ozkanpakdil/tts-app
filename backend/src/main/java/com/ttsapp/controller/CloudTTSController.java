package com.ttsapp.controller;

import com.ttsapp.dto.TTSRequest;
import com.ttsapp.model.User;
import com.ttsapp.service.CloudTTSService;
import com.ttsapp.service.UsageService;
import com.ttsapp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tts")
@RequiredArgsConstructor
@Slf4j
public class CloudTTSController {

    private final List<CloudTTSService> ttsServices;
    private final UsageService usageService;
    private final UserService userService;

    @PostMapping("/synthesize")
    public ResponseEntity<byte[]> synthesize(Principal principal, @Valid @RequestBody TTSRequest request) {
        String firebaseUid = principal.getName();
        log.info("Received TTS synthesis request for user: {} with provider: {}", firebaseUid, request.getProvider());
        
        User user = userService.getUserByFirebaseUid(firebaseUid)
                .orElseThrow(() -> {
                    log.error("User not found for UID: {}", firebaseUid);
                    return new RuntimeException("User not found");
                });

        CloudTTSService service = ttsServices.stream()
                .filter(s -> s.getProviderName().equalsIgnoreCase(request.getProvider()))
                .findFirst()
                .orElseThrow(() -> {
                    log.error("Provider not found: {}", request.getProvider());
                    return new RuntimeException("Provider not found: " + request.getProvider());
                });

        log.debug("Synthesizing speech for provider: {}", request.getProvider());
        byte[] audioData = service.synthesizeSpeech(request);

        // Log usage
        log.info("Logging usage for user: {} - {} characters", user.getEmail(), request.getText().length());
        usageService.logUsage(user, request.getProvider(), request.getText().length());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"speech.mp3\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(audioData);
    }
}
