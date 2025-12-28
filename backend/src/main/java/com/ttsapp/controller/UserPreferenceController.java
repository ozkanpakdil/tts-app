package com.ttsapp.controller;

import com.ttsapp.model.User;
import com.ttsapp.model.UserPreference;
import com.ttsapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/preferences")
public class UserPreferenceController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<UserPreference> getPreferences(@AuthenticationPrincipal String uid) {
        return userRepository.findByFirebaseUid(uid)
                .map(user -> ResponseEntity.ok(user.getPreferences()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<UserPreference> updatePreferences(
            @AuthenticationPrincipal String uid, 
            @RequestBody UserPreference newPrefs) {
        return userRepository.findByFirebaseUid(uid)
                .map(user -> {
                    UserPreference existing = user.getPreferences();
                    if (existing == null) {
                        existing = new UserPreference();
                        existing.setUser(user);
                    }
                    existing.setLanguage(newPrefs.getLanguage());
                    existing.setVoiceId(newPrefs.getVoiceId());
                    existing.setRate(newPrefs.getRate());
                    existing.setPitch(newPrefs.getPitch());
                    existing.setDarkMode(newPrefs.getDarkMode());
                    user.setPreferences(existing);
                    userRepository.save(user);
                    return ResponseEntity.ok(existing);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
