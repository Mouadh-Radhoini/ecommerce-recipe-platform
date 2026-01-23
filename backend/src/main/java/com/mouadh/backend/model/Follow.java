package com.mouadh.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "follows")
public class Follow {

    @Id
    private String id;

    // Buyer who follows
    private String followerId;

    // Chef being followed
    private String chefId;
}
