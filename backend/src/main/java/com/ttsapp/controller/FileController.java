package com.ttsapp.controller;

import com.ttsapp.service.FileProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileProcessingService fileProcessingService;

    @PostMapping("/extract-text")
    public ResponseEntity<Map<String, String>> extractText(@RequestParam("file") MultipartFile file) {
        log.info("Received file extraction request for: {}", file.getOriginalFilename());
        try {
            String text = fileProcessingService.extractText(file);
            Map<String, String> response = new HashMap<>();
            response.put("text", text);
            response.put("filename", file.getOriginalFilename());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid file format: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (IOException e) {
            log.error("Error processing file: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error processing file: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
