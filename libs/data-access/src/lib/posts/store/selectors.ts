import {createSelector} from "@ngrx/store";
import {postFeature} from "./reducer";

export const selectPosts = createSelector(
    postFeature.selectPosts,
    (posts) => posts
)