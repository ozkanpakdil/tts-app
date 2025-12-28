package com.ttsapp.service;

import com.ttsapp.dto.TTSRequest;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public abstract class AbstractCloudTTSService implements CloudTTSService {

    private static final int MAX_CHARS_PER_CHUNK = 4000; // conservative limit

    @Override
    public byte[] synthesizeSpeech(TTSRequest request) {
        String text = request.getText();
        if (text == null || text.length() <= MAX_CHARS_PER_CHUNK) {
            return synthesizeChunk(request);
        }

        List<String> chunks = splitText(text, MAX_CHARS_PER_CHUNK);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        for (String chunk : chunks) {
            TTSRequest chunkRequest = TTSRequest.builder()
                    .text(chunk)
                    .provider(request.getProvider())
                    .voiceId(request.getVoiceId())
                    .languageCode(request.getLanguageCode())
                    .speakingRate(request.getSpeakingRate())
                    .pitch(request.getPitch())
                    .audioQuality(request.getAudioQuality())
                    .build();
            
            byte[] audioData = synthesizeChunk(chunkRequest);
            try {
                outputStream.write(audioData);
            } catch (IOException e) {
                throw new RuntimeException("Error concatenating audio chunks", e);
            }
        }

        return outputStream.toByteArray();
    }

    protected abstract byte[] synthesizeChunk(TTSRequest request);

    private List<String> splitText(String text, int maxChars) {
        List<String> chunks = new ArrayList<>();
        int length = text.length();
        int start = 0;

        while (start < length) {
            int end = Math.min(start + maxChars, length);
            
            // Try to find a good breaking point (period, newline, space)
            if (end < length) {
                int lastPeriod = text.lastIndexOf('.', end);
                int lastNewline = text.lastIndexOf('\n', end);
                int lastSpace = text.lastIndexOf(' ', end);

                int breakPoint = Math.max(lastPeriod, Math.max(lastNewline, lastSpace));
                
                if (breakPoint > start) {
                    end = breakPoint + 1;
                }
            }
            
            chunks.add(text.substring(start, end).trim());
            start = end;
        }

        return chunks;
    }
}
