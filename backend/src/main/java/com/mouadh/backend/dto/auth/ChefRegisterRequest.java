package com.mouadh.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChefRegisterRequest {

    private String name;
    private String email;
    private String password;
}
