package com.mouadh.backend.controller;

import com.mouadh.backend.model.Notification;
import com.mouadh.backend.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping("/my")
    public List<Notification> my(Authentication auth) {
        // auth.getName() = buyerId OR chefId
        return service.myNotifications(auth.getName());
    }
}
