package com.mouadh.backend.service;

import com.mouadh.backend.model.Follow;
import com.mouadh.backend.repository.FollowRepository;
import org.springframework.stereotype.Service;

@Service
public class FollowService {

    private final FollowRepository repo;

    public FollowService(FollowRepository repo) {
        this.repo = repo;
    }

    public void followChef(String buyerId, String chefId) {

        repo.findByFollowerIdAndChefId(buyerId, chefId)
                .ifPresent(f -> {
                    throw new RuntimeException("Already following this chef");
                });

        Follow follow = new Follow();
        follow.setFollowerId(buyerId);
        follow.setChefId(chefId);

        repo.save(follow);
    }
}
