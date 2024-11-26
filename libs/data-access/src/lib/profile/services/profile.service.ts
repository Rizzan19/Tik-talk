import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GlobalStoreService, Pageble} from "@tt/data-access/shared"
import { map, tap } from 'rxjs';
import { Profile } from '@tt/data-access/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  #globalStoreService = inject(GlobalStoreService)
  baseApiUrl = '/yt-course/';

  me = signal<Profile | null>(null)

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    return this.http
      .get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(tap((res) => {
        this.me.set(res)
        this.#globalStoreService.me.set(res)
      }));
  }

  getSubscribersShortList(subsAmoun = 3) {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(map((res) => res.items.slice(0, subsAmoun)));
  }

  getAccount(id: number) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
        .pipe(tap((res) => {
          this.#globalStoreService.companion.set(res)
    }));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(`${this.baseApiUrl}account/me`, profile);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<File>(`${this.baseApiUrl}account/upload_image`, fd);
  }

  filterProfiles(params: Record<string, any>) {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, {
        params,
      })
  }
}
