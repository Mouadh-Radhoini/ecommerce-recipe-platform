import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../models/comment.model';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private readonly API_URL = `${environment.apiUrl}/api/comments`;

    constructor(private http: HttpClient) { }

    getCommentsByRecipe(recipeId: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.API_URL}/recipe/${recipeId}`);
    }

    createComment(comment: CreateCommentRequest): Observable<Comment> {
        return this.http.post<Comment>(this.API_URL, comment);
    }

    updateComment(comment: UpdateCommentRequest): Observable<Comment> {
        return this.http.put<Comment>(`${this.API_URL}/${comment.id}`, comment);
    }

    deleteComment(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    getReplies(parentId: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.API_URL}/${parentId}/replies`);
    }
}
