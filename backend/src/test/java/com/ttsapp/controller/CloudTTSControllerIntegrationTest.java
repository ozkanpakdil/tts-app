package com.ttsapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ttsapp.AbstractIntegrationTest;
import com.ttsapp.dto.TTSRequest;
import com.ttsapp.model.User;
import com.ttsapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
public class CloudTTSControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        User user = User.builder()
                .firebaseUid("test-uid")
                .email("test@example.com")
                .displayName("Test User")
                .build();
        userRepository.save(user);
    }

    @Test
    @WithMockUser(username = "test-uid")
    public void testSynthesizeSuccess() throws Exception {
        TTSRequest request = TTSRequest.builder()
                .text("Hello world")
                .provider("amazon")
                .voiceId("Joanna")
                .build();

        mockMvc.perform(post("/api/tts/synthesize")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "test-uid")
    public void testSynthesizeInvalidProvider() throws Exception {
        TTSRequest request = TTSRequest.builder()
                .text("Hello world")
                .provider("unknown")
                .build();

        mockMvc.perform(post("/api/tts/synthesize")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
