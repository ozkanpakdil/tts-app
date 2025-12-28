package com.ttsapp.service;

import com.ttsapp.dto.TTSRequest;

public interface CloudTTSService {
    byte[] synthesizeSpeech(TTSRequest request);

    String getProviderName();
}
