package com.mouadh.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BuyerRegisterRequest {

    private String name;
    private String email;
    private String password;
}
