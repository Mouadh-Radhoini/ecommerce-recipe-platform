package com.mouadh.backend.controller;

import com.mouadh.backend.dto.recipe.RecipeRequest;
import com.mouadh.backend.dto.recipe.RecipeResponse;
import com.mouadh.backend.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    // ---------------- CREATE RECIPE (CHEF ONLY) ----------------
    @PostMapping
    @PreAuthorize("hasRole('CHEF')")
    public RecipeResponse create(
            @Valid @RequestBody RecipeRequest request,
            Authentication authentication
    ) {
        return recipeService.createRecipe(request, authentication.getName());
    }

    // ---------------- LIST RECIPES (PREVIEW) ----------------
    @GetMapping
    public List<RecipeResponse> list() {
        return recipeService.getAllRecipes();
    }

    // ---------------- GET SINGLE RECIPE ----------------
    @GetMapping("/{id}")
    public RecipeResponse getById(
            @PathVariable String id,
            Authentication authentication
    ) {
        String userId = authentication != null ? authentication.getName() : null;
        return recipeService.getRecipeById(id, userId);
    }
}
