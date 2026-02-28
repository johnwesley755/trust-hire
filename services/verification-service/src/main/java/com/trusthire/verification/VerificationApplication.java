package com.trusthire.verification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class VerificationApplication {
    public static void main(String[] args) {
        SpringApplication.run(VerificationApplication.class, args);
    }
}
