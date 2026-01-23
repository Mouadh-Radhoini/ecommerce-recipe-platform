package com.mouadh.backend.dto.recipe;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

public class RecipeRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private List<String> ingredients;

    @NotNull
    private List<String> steps;

    private boolean premium;

    @PositiveOrZero
    private Double price;

    // getters & setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getIngredients() { return ingredients; }
    public void setIngredients(List<String> ingredients) { this.ingredients = ingredients; }

    public List<String> getSteps() { return steps; }
    public void setSteps(List<String> steps) { this.steps = steps; }

    public boolean isPremium() { return premium; }
    public void setPremium(boolean premium) { this.premium = premium; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}
