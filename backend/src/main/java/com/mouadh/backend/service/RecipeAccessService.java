package com.mouadh.backend.service;

import com.mouadh.backend.model.OrderStatus;
import com.mouadh.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service
public class RecipeAccessService {

    private final OrderRepository orderRepository;

    public RecipeAccessService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Checks if a buyer has paid access to a premium recipe
     */
    public boolean hasPaidAccess(String buyerId, String recipeId) {
        return orderRepository.findByBuyerIdAndRecipeId(buyerId, recipeId)
                .filter(order -> order.getStatus() == OrderStatus.PAID)
                .isPresent();
    }
}
