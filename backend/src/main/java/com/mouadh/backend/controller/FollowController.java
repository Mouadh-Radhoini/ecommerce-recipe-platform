package com.mouadh.backend.controller;

import com.mouadh.backend.service.FollowService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    private final FollowService service;

    public FollowController(FollowService service) {
        this.service = service;
    }

    @PostMapping("/{chefId}")
    @PreAuthorize("hasRole('BUYER')")
    public void follow(@PathVariable String chefId,
                       Authentication auth) {
        service.followChef(auth.getName(), chefId);
    }
}
