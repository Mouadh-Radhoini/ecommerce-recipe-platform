package com.mouadh.backend.service;

import com.mouadh.backend.dto.auth.BuyerRegisterRequest;
import com.mouadh.backend.dto.auth.ChefRegisterRequest;
import com.mouadh.backend.model.Buyer;
import com.mouadh.backend.model.Chef;
import com.mouadh.backend.model.BaseUser;
import com.mouadh.backend.repository.BuyerRepository;
import com.mouadh.backend.repository.ChefRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final BuyerRepository buyerRepository;
    private final ChefRepository chefRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(BuyerRepository buyerRepository,
                       ChefRepository chefRepository,
                       PasswordEncoder passwordEncoder) {
        this.buyerRepository = buyerRepository;
        this.chefRepository = chefRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerBuyer(BuyerRegisterRequest request) {

        if (emailExists(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Buyer buyer = new Buyer();
        buyer.setName(request.getName());
        buyer.setEmail(request.getEmail());
        buyer.setPassword(passwordEncoder.encode(request.getPassword()));
        buyer.setCreatedAt(LocalDateTime.now());

        buyerRepository.save(buyer);
    }

    public void registerChef(ChefRegisterRequest request) {

        if (emailExists(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Chef chef = new Chef();
        chef.setName(request.getName());
        chef.setEmail(request.getEmail());
        chef.setPassword(passwordEncoder.encode(request.getPassword()));
        chef.setCreatedAt(LocalDateTime.now());
        chef.setTotalEarnings(0.0);

        chefRepository.save(chef);
    }


    public BaseUser login(String email, String rawPassword) {

        Optional<? extends BaseUser> user =
                buyerRepository.findByEmail(email)
                        .map(b -> (BaseUser) b)
                        .or(() -> chefRepository.findByEmail(email)
                                .map(c -> (BaseUser) c));

        BaseUser foundUser = user
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(rawPassword, foundUser.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return foundUser;
    }

    private boolean emailExists(String email) {
        return buyerRepository.findByEmail(email).isPresent()
                || chefRepository.findByEmail(email).isPresent();
    }
}
