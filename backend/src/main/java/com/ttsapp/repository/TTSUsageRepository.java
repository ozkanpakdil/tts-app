package com.ttsapp.repository;

import com.ttsapp.model.TTSUsage;
import com.ttsapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TTSUsageRepository extends JpaRepository<TTSUsage, Long> {
    List<TTSUsage> findByUser(User user);
}
