package com.mouadh.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "chefs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chef extends BaseUser {

    private String stripeAccountId;
    private Double totalEarnings = 0.0;
}
