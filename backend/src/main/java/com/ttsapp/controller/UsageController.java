package com.ttsapp.controller;

import com.ttsapp.model.TTSUsage;
import com.ttsapp.model.User;
import com.ttsapp.service.UsageService;
import com.ttsapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usage")
@RequiredArgsConstructor
public class UsageController {
    private final UsageService usageService;
    private final UserService userService;

    @GetMapping("/history")
    public ResponseEntity<List<TTSUsage>> getUsageHistory(@AuthenticationPrincipal String firebaseUid) {
        User user = userService.getUserByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(usageService.getUserUsage(user));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getUsageSummary(@AuthenticationPrincipal String firebaseUid) {
        User user = userService.getUserByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCost", usageService.getTotalCost(user));
        summary.put("history", usageService.getUserUsage(user));
        
        return ResponseEntity.ok(summary);
    }
}
