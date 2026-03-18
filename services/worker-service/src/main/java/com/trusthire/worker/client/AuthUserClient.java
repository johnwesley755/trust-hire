package com.trusthire.worker.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "auth-service", url = "${AUTH_SERVICE_URL:http://localhost:8081}")
public interface AuthUserClient {

    @PostMapping("/api/auth/internal/users/by-ids")
    List<UserSummary> getUsersByIds(@RequestBody List<String> userIds);

    @Data
    class UserSummary {
        private String userId;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private String profileImageUrl;
    }
}
