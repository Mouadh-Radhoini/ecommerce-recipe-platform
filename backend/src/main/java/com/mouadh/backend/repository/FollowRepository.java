package com.mouadh.backend.repository;

import com.mouadh.backend.model.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FollowRepository extends MongoRepository<Follow, String> {

    Optional<Follow> findByFollowerIdAndChefId(String followerId, String chefId);
}
