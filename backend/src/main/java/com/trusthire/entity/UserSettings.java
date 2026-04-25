package com.trusthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Builder.Default
    private boolean emailNotifications = true;

    @Builder.Default
    private boolean pushNotifications = true;

    @Builder.Default
    private boolean marketingEmails = false;

    @Builder.Default
    private String theme = "light";

    @Builder.Default
    private String language = "en";

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
