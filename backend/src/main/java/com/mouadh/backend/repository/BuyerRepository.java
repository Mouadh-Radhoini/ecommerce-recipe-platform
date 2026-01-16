package com.mouadh.backend.repository;

import com.mouadh.backend.model.Buyer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BuyerRepository extends MongoRepository<Buyer, String> {

    Optional<Buyer> findByEmail(String email);
}
