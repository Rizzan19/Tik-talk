import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { PostComment, CommentCreateDto, Post, PostCreateDto } from "../interfaces/post.interface";
import { map, switchMap, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostService {
    #http = inject(HttpClient)
    baseApiUrl = 'https://icherniakov.ru/yt-course/'

    posts = signal<Post[]>([])

    createPost(payload: PostCreateDto) {
        return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload)
            .pipe(
                switchMap(() => {
                    return this.fetchPosts()
                })
            )
    }

    fetchPosts() {
        return this.#http.get<Post[]>(`${this.baseApiUrl}post/`)
            .pipe(
                tap(res => this.posts.set(res))
            )
    }

    deletePost(id: number) {
        return this.#http.delete<Post>(`${this.baseApiUrl}post/${id}`)
            .pipe(
                switchMap(() => {
                    return this.fetchPosts()
                })
            )
    }

    createComment(payload: CommentCreateDto) {
        return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload)
    }

    getCommentsByPostId(postId: number) {
        return this.#http.get<Post>(`${this.baseApiUrl}post/${postId}`)
            .pipe(
                map(res => res.comments)
            )
    }

    getComment(id: number) {
        return this.#http.get<PostComment>(`${this.baseApiUrl}comment/${id}/`)
    }
}