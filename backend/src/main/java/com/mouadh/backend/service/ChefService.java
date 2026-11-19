package com.mouadh.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.mouadh.backend.model.Chef;
import com.mouadh.backend.repository.ChefRepository;
import org.springframework.stereotype.Service;

@Service
public class ChefService {

    private final ChefRepository chefRepository;

    public ChefService(ChefRepository chefRepository) {
        this.chefRepository = chefRepository;
    }

    public Chef getById(String id) {
        return chefRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chef not found"));
    }
}
