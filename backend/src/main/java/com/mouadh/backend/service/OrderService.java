package com.mouadh.backend.service;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.mouadh.backend.model.Order;
import com.mouadh.backend.model.OrderStatus;
import com.mouadh.backend.model.Recipe;
import com.mouadh.backend.repository.OrderRepository;
import com.mouadh.backend.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final RecipeRepository recipeRepository;

    public OrderService(OrderRepository orderRepository,
                        RecipeRepository recipeRepository) {
        this.orderRepository = orderRepository;
        this.recipeRepository = recipeRepository;
    }

    public Order createOrder(String buyerId, String recipeId) {

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found"));

        if (!recipe.isPremium()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Free recipes do not require purchase");
        }

        if (recipe.getChefId().equals(buyerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chef cannot buy own recipe");
        }

        orderRepository.findByBuyerIdAndRecipeId(buyerId, recipeId)
                .ifPresent(o -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Recipe already purchased");
                });

        Order order = new Order();
        // Stable ID makes simultaneous attempts compete for the same MongoDB document.
        // The lookup above also recognizes older orders with generated IDs.
        order.setId(buyerId + ":" + recipeId);
        order.setBuyerId(buyerId);
        order.setRecipeId(recipeId);
        order.setAmount(recipe.getPrice());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        try {
            return orderRepository.insert(order);
        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Recipe already purchased", exception);
        }
    }

    public List<Order> getBuyerOrders(String buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    public void markOrderPaid(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
    }
}
