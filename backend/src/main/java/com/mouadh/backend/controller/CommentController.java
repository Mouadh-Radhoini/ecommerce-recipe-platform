package com.mouadh.backend.controller;

import com.mouadh.backend.model.Comment;
import com.mouadh.backend.service.CommentService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService service;

    public CommentController(CommentService service) {
        this.service = service;
    }

    @PostMapping("/{recipeId}")
    public Comment add(@PathVariable String recipeId,
                       @RequestBody String content,
                       Authentication auth) {
        return service.addComment(recipeId, auth.getName(), content);
    }

    @GetMapping("/{recipeId}")
    public List<Comment> list(@PathVariable String recipeId) {
        return service.byRecipe(recipeId);
    }
}
