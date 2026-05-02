package com.trusthire.service.impl;

import com.trusthire.client.TranslationClient;
import com.trusthire.service.TranslationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TranslationServiceImpl implements TranslationService {

    private final TranslationClient translationClient;

    @Override
    public String translate(String text, String sourceLang, String targetLang) {
        try {
            return translationClient.translate(text, sourceLang, targetLang);
        } catch (Exception e) {
            log.error("Failed to translate text: {}", e.getMessage());
            return text; // Fallback to original text
        }
    }

    @Override
    public List<String> translateBatch(List<String> texts, String sourceLang, String targetLang) {
        try {
            return translationClient.translateBatch(texts, sourceLang, targetLang);
        } catch (Exception e) {
            log.error("Failed to translate batch: {}", e.getMessage());
            return texts; // Fallback to original texts
        }
    }
}
