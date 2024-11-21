import { PostService } from "./services/post.service";
import { Post, PostComment } from "@tt/interfaces/posts/post.interface";
export * from './store'

export {
    type Post,
    type PostComment,
    PostService,
}