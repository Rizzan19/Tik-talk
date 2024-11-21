import {inject, Injectable} from "@angular/core";
import {PostService} from "../services/post.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {postActions} from "./actions";
import {map, switchMap, tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostEffects {
    postService = inject(PostService)
    actions$ = inject(Actions)

    fetchPosts = createEffect(() => {
        return this.actions$.pipe(
            ofType(postActions.fetchPosts),
            switchMap(() => {
                return this.postService.fetchPosts()
            }),
            map(res => postActions.postsLoaded({posts: res}))
        )
    })

    createPost = createEffect(() => {
        return this.actions$.pipe(
            ofType(postActions.createPost),
            switchMap(({payload}) => {
                return this.postService.createPost({
                    title: payload.title,
                    content: payload.content,
                    authorId: payload.authorId
                })
            }),
            map(res => postActions.postsLoaded({posts: res}))
        )
    })

    deletePost = createEffect(() => {
        return this.actions$.pipe(
            ofType(postActions.deletePost),
            switchMap(({postId}) => {
                return this.postService.deletePost(postId)
            }),
            map(() => postActions.fetchPosts({}))
        )
    })

   createComment = createEffect(() => {
       return this.actions$.pipe(
           ofType(postActions.createComment),
           switchMap(({payload}) => {
               return this.postService.createComment({
                   text: payload.text,
                   authorId: payload.authorId,
                   postId: payload.postId,
               })
           }),
           map(() => postActions.fetchPosts({}))
       )
   })
}