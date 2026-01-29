package com.mouadh.backend.controller;

import com.mouadh.backend.dto.auth.*;
import com.mouadh.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/buyer")
    public AuthResponse registerBuyer(@Valid @RequestBody BuyerRegisterRequest req) {
        return authService.registerBuyer(req);
    }

    @PostMapping("/register/chef")
    public AuthResponse registerChef(@Valid @RequestBody ChefRegisterRequest req) {
        return authService.registerChef(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }
}
