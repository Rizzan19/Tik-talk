import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, switchMap} from 'rxjs';
import {CommentCreateDto, Post, PostComment, PostCreateDto} from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload).pipe(
      switchMap(() => {
        return this.fetchPosts();
      })
    );
  }

  fetchPosts() {
    return this.#http.get<Post[]>(`${this.baseApiUrl}post/`)
  }

  deletePost(postId: number) {
    return this.#http.delete<Post>(`${this.baseApiUrl}post/${postId}`)
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload);
  }

  getCommentsByPostId(postId: number) {
    return this.#http
      .get<Post>(`${this.baseApiUrl}post/${postId}`)
      .pipe(map((res) => res.comments));
  }

  getComment(id: number) {
    return this.#http.get<PostComment>(`${this.baseApiUrl}comment/${id}/`);
  }
}
