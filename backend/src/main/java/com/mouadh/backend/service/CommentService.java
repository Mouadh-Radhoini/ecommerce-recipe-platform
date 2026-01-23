package com.mouadh.backend.service;

import com.mouadh.backend.model.Comment;
import com.mouadh.backend.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository repo;

    public CommentService(CommentRepository repo) {
        this.repo = repo;
    }

    public Comment addComment(String recipeId, String authorId, String content) {
        Comment c = new Comment();
        c.setRecipeId(recipeId);
        c.setUserId(authorId); // buyer or chef
        c.setContent(content);
        c.setCreatedAt(LocalDateTime.now());
        return repo.save(c);
    }

    public List<Comment> byRecipe(String recipeId) {
        return repo.findByRecipeId(recipeId);
    }
}
