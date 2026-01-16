package com.mouadh.backend.repository;

import com.mouadh.backend.model.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends MongoRepository<Follow, String> {

    Optional<Follow> findByBuyerIdAndChefId(String buyerId, String chefId);

    List<Follow> findByBuyerId(String buyerId);

    List<Follow> findByChefId(String chefId);
}
