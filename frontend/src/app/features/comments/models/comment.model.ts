export interface Comment {
    id: string;
    recipeId: string;
    userId: string;
    username: string;
    userAvatarUrl?: string;
    content: string;
    rating?: number; // 1-5 stars
    parentId?: string; // For nested replies
    replies?: Comment[];
    createdAt: Date;
    updatedAt?: Date;
}

export interface CreateCommentRequest {
    recipeId: string;
    content: string;
    rating?: number;
    parentId?: string;
}

export interface UpdateCommentRequest {
    id: string;
    content: string;
}
