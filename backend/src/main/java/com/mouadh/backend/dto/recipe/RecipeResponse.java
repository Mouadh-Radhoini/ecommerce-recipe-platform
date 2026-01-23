package com.mouadh.backend.dto.recipe;

import java.util.List;

public class RecipeResponse {

    private String id;
    private String title;
    private String description;
    private List<String> ingredients;
    private List<String> steps;
    private boolean premium;
    private Double price;
    private boolean fullAccess;

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public boolean isFullAccess() { return fullAccess; }
    public void setFullAccess(boolean fullAccess) { this.fullAccess = fullAccess; }
}
