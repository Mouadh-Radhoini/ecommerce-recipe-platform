package com.mouadh.backend.repository;

import com.mouadh.backend.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RecipeRepository extends MongoRepository<Recipe, String> {

    List<Recipe> findByChefId(String chefId);
}
