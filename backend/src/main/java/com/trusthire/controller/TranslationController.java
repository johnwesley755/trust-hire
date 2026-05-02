package com.trusthire.controller;

import com.trusthire.client.TranslationClient;
import com.trusthire.service.TranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/translate")
@RequiredArgsConstructor
public class TranslationController {

    private final TranslationService translationService;

    @PostMapping
    public ResponseEntity<TranslationClient.TranslationResponse> translate(@RequestBody TranslationClient.TranslationRequest request) {
        String translatedText = translationService.translate(
            request.getText(), 
            request.getSource_language(), 
            request.getTarget_language()
        );
        
        TranslationClient.TranslationResponse response = new TranslationClient.TranslationResponse();
        response.setTranslated_text(translatedText);
        response.setSource_language(request.getSource_language());
        response.setTarget_language(request.getTarget_language());
        response.setProvider("IndicTrans2-Proxy");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/batch")
    public ResponseEntity<TranslationClient.BatchTranslationResponse> translateBatch(@RequestBody TranslationClient.BatchTranslationRequest request) {
        List<String> translatedTexts = translationService.translateBatch(
            request.getTexts(), 
            request.getSource_language(), 
            request.getTarget_language()
        );
        
        TranslationClient.BatchTranslationResponse response = new TranslationClient.BatchTranslationResponse();
        response.setTranslated_texts(translatedTexts);
        response.setSource_language(request.getSource_language());
        response.setTarget_language(request.getTarget_language());
        response.setProvider("IndicTrans2-Proxy");
        
        return ResponseEntity.ok(response);
    }
}
