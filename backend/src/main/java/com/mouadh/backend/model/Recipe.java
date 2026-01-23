package com.mouadh.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "recipes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {

    @Id
    private String id;

    private String title;

    private String description;

    private List<String> ingredients;

    private List<String> steps;

    private boolean premium;

    private Double price;

    private String chefId;

    private LocalDateTime createdAt;
}
