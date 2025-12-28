package com.ttsapp.service.impl;

import com.ttsapp.dto.TTSRequest;
import com.ttsapp.service.AbstractCloudTTSService;
import com.ttsapp.service.CloudTTSService;
import org.springframework.stereotype.Service;

@Service
public class AzureTTSService extends AbstractCloudTTSService {
    @Override
    protected byte[] synthesizeChunk(TTSRequest request) {
        // Mock: Return a dummy byte array
        // In reality, this would use Azure SDK
        return "Mock Azure TTS Audio Data".getBytes();
    }

    @Override
    public String getProviderName() {
        return "azure";
    }
}
