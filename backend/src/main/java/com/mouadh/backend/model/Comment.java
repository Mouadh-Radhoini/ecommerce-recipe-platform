package com.mouadh.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    // Recipe being commented on
    private String recipeId;

    // Author of the comment (buyerId OR chefId)
    private String userId;

    private String content;

    private LocalDateTime createdAt;
}
