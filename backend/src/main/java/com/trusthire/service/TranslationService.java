package com.trusthire.service;

import java.util.List;

public interface TranslationService {
    String translate(String text, String sourceLang, String targetLang);
    List<String> translateBatch(List<String> texts, String sourceLang, String targetLang);
}
