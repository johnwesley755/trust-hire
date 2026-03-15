package com.trusthire.employer.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${JWT_SECRET:Q7mV2f8YbKc6n4GxR1Pz9TqJ5sH3W8dL0uCkE2aB7yFvM6rN1tX4pS9ZgH5jU3w}")
    private String jwtSecret;

    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            System.out.println("DEBUG: Employer SecurityConfig - JWT_SECRET Fingerprint (SHA-256): " + hexString.toString());
        } catch (Exception e) {
            System.err.println("DEBUG: Employer SecurityConfig - Could not generate secret fingerprint: " + e.getMessage());
        }
        
        if ("Q7mV2f8YbKc6n4GxR1Pz9TqJ5sH3W8dL0uCkE2aB7yFvM6rN1tX4pS9ZgH5jU3w".equals(jwtSecret)) {
            System.err.println("WARNING: Employer Service is using the DEFAULT JWT_SECRET fallback!");
        }
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/employer/profile", "/api/employer/profile/**").authenticated()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.decoder(jwtDecoder()))
                )
                .addFilterBefore(new RequestLoggingFilter(), UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            String secretDebug = (jwtSecret != null && jwtSecret.length() > 5) ? 
                                jwtSecret.substring(0, 5) + "..." : "null/short";
                            System.err.println("DEBUG: Employer Security - Authentication Failure: " + authException.getMessage());
                            System.err.println("DEBUG: Employer Security - Loaded Secret Starts With: " + secretDebug);
                            
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write(String.format(
                                "{\"error\": \"Unauthorized\", \"message\": \"%s\", \"debug_secret_prefix\": \"%s\"}", 
                                authException.getMessage(), secretDebug));
                        })
                );
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        System.out.println("DEBUG: Employer SecurityConfig - Creating Relaxed JwtDecoder with secret length: " + (jwtSecret != null ? jwtSecret.length() : "null"));
        SecretKeySpec secretKey = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(secretKey).build();

        // Relax validation: only check timestamps, ignore issuer/audience
        OAuth2TokenValidator<Jwt> withTimestamp = new JwtTimestampValidator();
        jwtDecoder.setJwtValidator(withTimestamp);

        return jwtDecoder;
    }

    private static class RequestLoggingFilter extends OncePerRequestFilter {
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            System.out.println("DEBUG: Employer Request - URI: " + request.getRequestURI());
            System.out.println("DEBUG: Employer Request - Method: " + request.getMethod());
            java.util.Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String name = headerNames.nextElement();
                String value = request.getHeader(name);
                if (name.equalsIgnoreCase("Authorization")) {
                    System.out.println("DEBUG: Employer Request - Header: " + name + " = " + (value.length() > 20 ? value.substring(0, 20) + "..." : value));
                } else {
                    System.out.println("DEBUG: Employer Request - Header: " + name + " = " + value);
                }
            }
            filterChain.doFilter(request, response);
        }
    }
}
