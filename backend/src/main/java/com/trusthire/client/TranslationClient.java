package com.trusthire.client;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class TranslationClient {

    private final RestTemplate restTemplate;
    
    @Value("${ai.translation-service.url:http://localhost:8000}")
    private String translationServiceUrl;

    public TranslationClient() {
        this.restTemplate = new RestTemplate();
    }

    @Data
    public static class TranslationRequest {
        private String source_language;
        private String target_language;
        private String text;
    }

    @Data
    public static class BatchTranslationRequest {
        private String source_language;
        private String target_language;
        private List<String> texts;
    }

    @Data
    public static class TranslationResponse {
        private String translated_text;
        private String source_language;
        private String target_language;
        private String provider;
    }

    @Data
    public static class BatchTranslationResponse {
        private List<String> translated_texts;
        private String source_language;
        private String target_language;
        private String provider;
    }

    public String translate(String text, String sourceLang, String targetLang) {
        TranslationRequest request = new TranslationRequest();
        request.setSource_language(sourceLang);
        request.setTarget_language(targetLang);
        request.setText(text);

        TranslationResponse response = restTemplate.postForObject(
            translationServiceUrl + "/translate",
            request,
            TranslationResponse.class
        );

        return response != null ? response.getTranslated_text() : null;
    }

    public List<String> translateBatch(List<String> texts, String sourceLang, String targetLang) {
        BatchTranslationRequest request = new BatchTranslationRequest();
        request.setSource_language(sourceLang);
        request.setTarget_language(targetLang);
        request.setTexts(texts);

        BatchTranslationResponse response = restTemplate.postForObject(
            translationServiceUrl + "/translate-batch",
            request,
            BatchTranslationResponse.class
        );

        return response != null ? response.getTranslated_texts() : null;
    }
}
