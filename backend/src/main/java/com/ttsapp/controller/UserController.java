package com.ttsapp.controller;

import com.ttsapp.model.User;
import com.ttsapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/sync")
    public ResponseEntity<User> syncUser(@RequestBody UserSyncRequest request) {
        User user = userService.syncUser(
                request.getFirebaseUid(),
                request.getEmail(),
                request.getDisplayName(),
                request.getPhotoUrl()
        );
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{firebaseUid}")
    public ResponseEntity<User> getUser(@PathVariable String firebaseUid) {
        return userService.getUserByFirebaseUid(firebaseUid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe(@AuthenticationPrincipal String firebaseUid) {
        userService.deleteUser(firebaseUid);
        return ResponseEntity.noContent().build();
    }

    @lombok.Data
    public static class UserSyncRequest {
        private String firebaseUid;
        private String email;
        private String displayName;
        private String photoUrl;
    }
}
