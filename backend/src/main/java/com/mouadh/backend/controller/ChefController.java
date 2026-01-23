package com.mouadh.backend.controller;

import com.mouadh.backend.model.Chef;
import com.mouadh.backend.service.ChefService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chefs")
public class ChefController {

    private final ChefService chefService;

    public ChefController(ChefService chefService) {
        this.chefService = chefService;
    }

    @GetMapping("/me")
    public Chef me(Authentication auth) {
        return chefService.getById(auth.getName());
    }
}
