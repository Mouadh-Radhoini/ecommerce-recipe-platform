package com.mouadh.backend.service;

import com.mouadh.backend.model.Buyer;
import com.mouadh.backend.repository.BuyerRepository;
import org.springframework.stereotype.Service;

@Service
public class BuyerService {

    private final BuyerRepository buyerRepository;

    public BuyerService(BuyerRepository buyerRepository) {
        this.buyerRepository = buyerRepository;
    }

    public Buyer getById(String id) {
        return buyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
    }
}
