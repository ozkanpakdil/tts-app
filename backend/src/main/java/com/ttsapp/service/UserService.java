package com.ttsapp.service;

import com.ttsapp.model.User;
import com.ttsapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public User syncUser(String firebaseUid, String email, String displayName, String photoUrl) {
        Optional<User> existingUser = userRepository.findByFirebaseUid(firebaseUid);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setDisplayName(displayName);
            user.setPhotoUrl(photoUrl);
            user.setLastLogin(LocalDateTime.now());
            return userRepository.save(user);
        } else {
            User newUser = User.builder()
                    .firebaseUid(firebaseUid)
                    .email(email)
                    .displayName(displayName)
                    .photoUrl(photoUrl)
                    .build();
            return userRepository.save(newUser);
        }
    }

    public Optional<User> getUserByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid);
    }

    @Transactional
    public void deleteUser(String firebaseUid) {
        userRepository.findByFirebaseUid(firebaseUid).ifPresent(userRepository::delete);
    }
}
