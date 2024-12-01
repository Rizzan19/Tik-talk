import {createFeature, createReducer, on} from "@ngrx/store";
import {profileActions} from "./actions";
import { Profile } from "../interfaces/profile.interface";

export interface ProfileState {
    profiles: Profile[],
    profileFilters: Record<string, any>,
    page: number,
    size: number
}

export const initialState: ProfileState = {
    profiles: [],
    profileFilters: {},
    page: 1,
    size: 60
}

export const profileFeature = createFeature({
    name: 'profileFeature',
    reducer: createReducer(
        initialState,
        on(profileActions.profilesLoaded, (state, payload) => {
            const profiles = payload.profiles.filter((profile) => profile.avatarUrl !== null)
            return {
                ...state,
                // profiles: state.profiles.concat(payload.profiles),
                profiles: state.profiles.concat(profiles)
            }
        }),
        on(profileActions.filterEvents, (state, payload) => {
            return {
                ...state,
                profiles: [],
                profileFilters: payload.filters,
                page: 1
            }
        }),
        on(profileActions.setPage, (state, payload) => {
            let page = payload.page
            if (!page) page = state.page + 1

            return {
                ...state,
                page
            }
        })
    )
})