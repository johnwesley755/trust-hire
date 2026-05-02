package com.trusthire.service.impl;

import com.trusthire.dto.request.EarlyAccessDto;
import com.trusthire.entity.EarlyAccessRequest;
import com.trusthire.repository.EarlyAccessRepository;
import com.trusthire.service.EarlyAccessService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class EarlyAccessServiceImpl implements EarlyAccessService {

    private final EarlyAccessRepository earlyAccessRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${BREVO_API_KEY:}")
    private String apiKey;

    @Value("${BREVO_SENDER_EMAIL:}")
    private String fromEmail;

    @Value("${BREVO_SENDER_NAME:TrustHire}")
    private String fromName;

    public EarlyAccessServiceImpl(EarlyAccessRepository earlyAccessRepository) {
        this.earlyAccessRepository = earlyAccessRepository;
    }

    @Override
    public void requestEarlyAccess(EarlyAccessDto dto) {
        // Check if already registered
        Optional<EarlyAccessRequest> existing = earlyAccessRepository.findByEmailAndSource(dto.getEmail(), dto.getSource());
        if (existing.isPresent()) {
            // Already registered, just return silently or you could throw an exception
            return;
        }

        EarlyAccessRequest request = EarlyAccessRequest.builder()
                .email(dto.getEmail())
                .source(dto.getSource())
                .build();
        earlyAccessRepository.save(request);

        sendConfirmationEmail(dto.getEmail(), dto.getSource());
    }

    private void sendConfirmationEmail(String toEmail, String source) {
        try {
            if (apiKey == null || apiKey.isEmpty()) {
                log.error("BREVO_API_KEY is missing from environment!");
                return;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);
            headers.set("x-sib-api-key", apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", Map.of("name", fromName, "email", fromEmail));
            body.put("to", Collections.singletonList(Map.of("email", toEmail)));
            
            String subject = source.equalsIgnoreCase("employer") 
                ? "Welcome to the TrustHire Employer Waitlist" 
                : "Welcome to the TrustHire Worker Waitlist";
            
            body.put("subject", subject);
            body.put("htmlContent", getHtmlTemplate(source));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity("https://api.brevo.com/v3/smtp/email", entity, String.class);
            log.info("Early access confirmation sent to {} via Brevo", toEmail);
        } catch (Exception e) {
            log.error("Failed to send early access confirmation to {}: {}", toEmail, e.getMessage());
        }
    }

    private String getHtmlTemplate(String source) {
        String roleSpecificMessage = source.equalsIgnoreCase("employer")
                ? "You're on the list to get early access to India's most trusted pool of verified workers. We will notify you as soon as your employer account is ready for activation."
                : "You're on the list to get early access to India's top employers. We will notify you as soon as you can complete your profile and start applying to jobs.";

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Inter', -apple-system, sans-serif; background-color: #f5f4ef; color: #1b1c19; margin: 0; padding: 40px 0; }" +
                "  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }" +
                "  .header { background-color: #1f3f34; padding: 40px 30px; text-align: center; border-bottom: 4px solid #facd15; }" +
                "  .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }" +
                "  .header p { color: #facd15; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }" +
                "  .content { padding: 40px 30px; text-align: left; }" +
                "  .content h2 { font-size: 22px; margin-top: 0; color: #1f3f34; }" +
                "  .content p { font-size: 16px; line-height: 1.6; color: #4a4b48; margin-bottom: 24px; }" +
                "  .highlight-box { background-color: rgba(250, 205, 21, 0.1); border-left: 4px solid #facd15; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0; }" +
                "  .highlight-box p { margin: 0; font-weight: 500; color: #1f3f34; }" +
                "  .footer { background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee; }" +
                "  .footer p { margin: 0; font-size: 12px; color: #888888; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='header'>" +
                "      <h1>TrustHire</h1>" +
                "      <p>Early Access Waitlist</p>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <h2>You're on the list! 🎉</h2>" +
                "      <p>Thank you for your interest in TrustHire. We have successfully received your early access request.</p>" +
                "      <div class='highlight-box'>" +
                "        <p>" + roleSpecificMessage + "</p>" +
                "      </div>" +
                "      <p>We're working hard to prepare the platform for our early adopters. Keep an eye on your inbox for your exclusive invitation.</p>" +
                "      <p>Best regards,<br><strong>The TrustHire Team</strong></p>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      <p>&copy; " + java.time.Year.now().getValue() + " TrustHire. All rights reserved.</p>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }
}
