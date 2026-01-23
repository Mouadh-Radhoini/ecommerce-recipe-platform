package com.mouadh.backend.controller;

import com.mouadh.backend.model.Buyer;
import com.mouadh.backend.service.BuyerService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buyers")
public class BuyerController {

    private final BuyerService buyerService;

    public BuyerController(BuyerService buyerService) {
        this.buyerService = buyerService;
    }

    @GetMapping("/me")
    public Buyer me(Authentication auth) {
        return buyerService.getById(auth.getName());
    }
}
