import {createActionGroup, props} from "@ngrx/store";
import {CommentCreateDto, Post, PostCreateDto} from "@tt/interfaces/posts/post.interface";

export const postActions = createActionGroup({
    source: 'post',
    events: {
        'fetch posts': props<{ page?: number }>(),
        'posts loaded': props<{ posts: Post[] }>(),
        'create post': props<{ payload: PostCreateDto }>(),
        'delete post': props<{ postId: number }>(),

        'create comment': props<{ payload: CommentCreateDto }>(),
    }
})
