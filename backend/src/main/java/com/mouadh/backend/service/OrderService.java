package com.mouadh.backend.service;

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
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        if (!recipe.isPremium()) {
            throw new RuntimeException("Free recipes do not require purchase");
        }

        if (recipe.getChefId().equals(buyerId)) {
            throw new RuntimeException("Chef cannot buy own recipe");
        }

        orderRepository.findByBuyerIdAndRecipeId(buyerId, recipeId)
                .ifPresent(o -> {
                    throw new RuntimeException("Recipe already purchased");
                });

        Order order = new Order();
        order.setBuyerId(buyerId);
        order.setRecipeId(recipeId);
        order.setAmount(recipe.getPrice());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public List<Order> getBuyerOrders(String buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    public void markOrderPaid(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
    }
}
