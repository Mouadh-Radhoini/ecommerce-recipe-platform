package com.mouadh.backend.service;

import com.mouadh.backend.dto.recipe.RecipeRequest;
import com.mouadh.backend.dto.recipe.RecipeResponse;
import com.mouadh.backend.model.Recipe;
import com.mouadh.backend.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final RecipeAccessService recipeAccessService;

    public RecipeService(RecipeRepository recipeRepository,
                         RecipeAccessService recipeAccessService) {
        this.recipeRepository = recipeRepository;
        this.recipeAccessService = recipeAccessService;
    }

    // ---------------- CREATE RECIPE ----------------
    public RecipeResponse createRecipe(RecipeRequest request, String chefId) {

        Recipe recipe = new Recipe();
        recipe.setTitle(request.getTitle());
        recipe.setDescription(request.getDescription());
        recipe.setIngredients(request.getIngredients());
        recipe.setSteps(request.getSteps());
        recipe.setPremium(request.isPremium());
        recipe.setPrice(request.isPremium() ? request.getPrice() : 0.0);
        recipe.setChefId(chefId);
        recipe.setCreatedAt(LocalDateTime.now());

        Recipe saved = recipeRepository.save(recipe);

        return mapToResponse(saved, true);
    }

    // ---------------- GET ALL RECIPES (PREVIEW) ----------------
    public List<RecipeResponse> getAllRecipes() {
        return recipeRepository.findAll()
                .stream()
                .map(recipe -> mapToResponse(recipe, false))
                .collect(Collectors.toList());
    }

    // ---------------- GET SINGLE RECIPE WITH ACCESS CONTROL ----------------
    public RecipeResponse getRecipeById(String recipeId, String userId) {

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        boolean fullAccess =
                !recipe.isPremium()
                        || recipe.getChefId().equals(userId)
                        || (userId != null && recipeAccessService.hasPaidAccess(userId, recipeId));

        return mapToResponse(recipe, fullAccess);
    }

    // ---------------- MAPPER ----------------
    private RecipeResponse mapToResponse(Recipe recipe, boolean fullAccess) {

        RecipeResponse response = new RecipeResponse();
        response.setId(recipe.getId());
        response.setTitle(recipe.getTitle());
        response.setDescription(recipe.getDescription());
        response.setPremium(recipe.isPremium());
        response.setPrice(recipe.getPrice());
        response.setFullAccess(fullAccess);

        if (fullAccess) {
            response.setIngredients(recipe.getIngredients());
            response.setSteps(recipe.getSteps());
        }

        return response;
    }
}
