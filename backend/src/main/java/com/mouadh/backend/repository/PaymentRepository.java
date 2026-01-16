package com.mouadh.backend.repository;

import com.mouadh.backend.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {

    Optional<Payment> findByOrderId(String orderId);

    Optional<Payment> findByStripeSessionId(String stripeSessionId);
}
