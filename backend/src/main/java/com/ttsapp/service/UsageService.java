package com.ttsapp.service;

import com.ttsapp.model.TTSUsage;
import com.ttsapp.model.User;
import com.ttsapp.repository.TTSUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsageService {
    private final TTSUsageRepository usageRepository;

    @Transactional
    public TTSUsage logUsage(User user, String provider, Integer characterCount) {
        double rate = 0.000004; // $4.00 per 1M characters
        double estimatedCost = characterCount * rate;

        TTSUsage usage = TTSUsage.builder()
                .user(user)
                .provider(provider)
                .characterCount(characterCount)
                .estimatedCost(estimatedCost)
                .build();

        return usageRepository.save(usage);
    }

    public List<TTSUsage> getUserUsage(User user) {
        return usageRepository.findByUser(user);
    }
    
    public Double getTotalCost(User user) {
        return getUserUsage(user).stream()
                .mapToDouble(TTSUsage::getEstimatedCost)
                .sum();
    }
}
