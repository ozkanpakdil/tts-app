package com.ttsapp.service;

import com.ttsapp.dto.VoiceDTO;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class VoiceServiceTest {

    private VoiceService voiceService = new VoiceService();

    @Test
    public void testGetAllVoices() {
        List<VoiceDTO> voices = voiceService.getAllVoices();
        assertFalse(voices.isEmpty());
    }

    @Test
    public void testGetVoicesByProvider() {
        List<VoiceDTO> googleVoices = voiceService.getVoicesByProvider("google");
        assertFalse(googleVoices.isEmpty());
        googleVoices.forEach(v -> assertEquals("google", v.getProvider()));
    }

    @Test
    public void testGetLanguages() {
        List<String> languages = voiceService.getLanguages();
        assertTrue(languages.contains("en-US"));
    }
}
