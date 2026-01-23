package com.mouadh.backend.service;

import com.mouadh.backend.dto.auth.AuthResponse;
import com.mouadh.backend.dto.auth.BuyerRegisterRequest;
import com.mouadh.backend.dto.auth.ChefRegisterRequest;
import com.mouadh.backend.dto.auth.LoginRequest;
import com.mouadh.backend.model.BaseUser;
import com.mouadh.backend.model.Buyer;
import com.mouadh.backend.model.Chef;
import com.mouadh.backend.repository.BuyerRepository;
import com.mouadh.backend.repository.ChefRepository;
import com.mouadh.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final BuyerRepository buyerRepository;
    private final ChefRepository chefRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(BuyerRepository buyerRepository,
                       ChefRepository chefRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.buyerRepository = buyerRepository;
        this.chefRepository = chefRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ---------------- REGISTER BUYER ----------------
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

    // ---------------- REGISTER CHEF ----------------
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

    // ---------------- LOGIN ----------------
    public AuthResponse login(LoginRequest request) {

        BaseUser user = buyerRepository.findByEmail(request.getEmail())
                .map(b -> (BaseUser) b)
                .or(() -> chefRepository.findByEmail(request.getEmail())
                        .map(c -> (BaseUser) c))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String role = (user instanceof Chef) ? "ROLE_CHEF" : "ROLE_BUYER";

        String token = jwtService.generateToken(user.getId(), role);

        return new AuthResponse(token, role);
    }

    // ---------------- UTILITY ----------------
    private boolean emailExists(String email) {
        return buyerRepository.findByEmail(email).isPresent()
                || chefRepository.findByEmail(email).isPresent();
    }
}
