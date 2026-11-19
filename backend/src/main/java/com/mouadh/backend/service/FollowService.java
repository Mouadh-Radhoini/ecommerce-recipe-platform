package com.mouadh.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Already following this chef");
                });

        Follow follow = new Follow();
        follow.setFollowerId(buyerId);
        follow.setChefId(chefId);

        repo.save(follow);
    }
}
