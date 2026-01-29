package com.mouadh.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AuthUserResponse {
    private String id;
    private String email;
    private String username;
    private String role;
    private LocalDateTime createdAt;
}
