package com.mouadh.backend.service;

import com.mouadh.backend.model.Notification;
import com.mouadh.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    // Create notification (used internally)
    public void notifyUser(String userId, String message) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setMessage(message);
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());
        repo.save(n);
    }

    // Get current user's notifications
    public List<Notification> myNotifications(String userId) {
        return repo.findByUserId(userId);
    }
}
