import { Routes } from '@angular/router';
import { canActivateAuth } from '@tt/data-access/auth';
import { chatsRoutes } from '@tt/chats';
import {FormsExperimentalComponent, FormComponent, FormSuccessComponent} from '@tt/experimental';
import {LayoutComponent} from "@tt/layout";
import {SearchPageComponent, ProfilePageComponent, SettingsPageComponent} from '@tt/profile';
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {PostEffects, postFeature} from "@tt/posts";
import {ProfileEffects, profileFeature} from "@tt/data-access/profile";
// @ts-ignore
import {LoginPageComponent} from "@tt/auth";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
            provideState(postFeature),
            provideEffects(PostEffects)
        ]
      },
      { path: 'settings', component: SettingsPageComponent },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
            provideState(profileFeature),
            provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'experimental', component: FormsExperimentalComponent },
  { path: 'form', component: FormComponent },
  { path: 'success', component: FormSuccessComponent }
];
