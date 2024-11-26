import {AsyncPipe} from '@angular/common';
import { ProfileHeaderComponent } from '../../ui';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from '@tt/common-ui';
import { ImgUrlPipe } from '@tt/common-ui';
import { PostFeedComponent } from "@tt/posts";
import { ProfileService } from "@tt/data-access/profile";
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersShortList(5);

  isMyPage = signal<boolean>(false);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
      this.router.navigate(['/chats', 'new'], {queryParams: {userId}});
      }
}
