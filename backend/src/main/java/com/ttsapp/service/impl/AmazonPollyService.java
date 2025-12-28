package com.ttsapp.service.impl;

import com.ttsapp.dto.TTSRequest;
import com.ttsapp.service.AbstractCloudTTSService;
import com.ttsapp.service.CloudTTSService;
import org.springframework.stereotype.Service;

@Service
public class AmazonPollyService extends AbstractCloudTTSService {
    @Override
    protected byte[] synthesizeChunk(TTSRequest request) {
        // Mock: Return a dummy byte array
        // In reality, this would use Amazon SDK
        return "Mock Amazon Polly Audio Data".getBytes();
    }

    @Override
    public String getProviderName() {
        return "amazon";
    }
}
