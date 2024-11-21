import {Post} from "@tt/interfaces/posts/post.interface";
import {createFeature, createReducer, on} from "@ngrx/store";
import {postActions} from "./actions";

export interface PostState {
    posts: Post[]
}

export const initialState: PostState = {
    posts: []
}

export const postFeature = createFeature({
    name: 'postFeature',
    reducer: createReducer(
        initialState,
        on(postActions.postsLoaded, (state, payload) => {
            return {
                ...state,
                posts: payload.posts,
            }
        }),
        on(postActions.deletePost, (state, payload) => {
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== payload.postId)
            }
        })
    )
})