import { Routes } from '@angular/router';
import { LoginPageComponent, canActivateAuth } from '@tt/auth';
import { chatsRoutes } from '@tt/chats';
import { FormsExperimentalComponent, FormComponent } from '@tt/experimental';
import {LayoutComponent} from "@tt/layout";
import { SearchPageComponent, ProfilePageComponent, SettingsPageComponent } from '@tt/profile';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'search', component: SearchPageComponent },
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
];
