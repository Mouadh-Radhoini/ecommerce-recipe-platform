package com.mouadh.backend.controller;

import com.mouadh.backend.model.Order;
import com.mouadh.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/{recipeId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<Order> createOrder(
            @PathVariable String recipeId,
            Authentication authentication
    ) {
        String buyerId = authentication.getName();
        return ResponseEntity.ok(orderService.createOrder(buyerId, recipeId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<List<Order>> myOrders(Authentication authentication) {
        String buyerId = authentication.getName();
        return ResponseEntity.ok(orderService.getBuyerOrders(buyerId));
    }
}
