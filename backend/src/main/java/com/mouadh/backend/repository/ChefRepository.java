package com.mouadh.backend.repository;

import com.mouadh.backend.model.Chef;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ChefRepository extends MongoRepository<Chef, String> {

    Optional<Chef> findByEmail(String email);
}
