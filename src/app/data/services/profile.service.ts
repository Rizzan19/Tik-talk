import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Profile} from "../interfaces/profile.interface";
import { Pageble } from '../interfaces/pageble.interface';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseApiUrl = 'https://icherniakov.ru/yt-course/'
  http = inject(HttpClient)
  me = signal<Profile | null>(null)
  filteredProfiles = signal<Profile[]>([])

  constructor() { }

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`)
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(
        tap(res => this.me.set(res))
      )
  }

  getSubscribersShortList(subsAmoun = 3) {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(
        map(res => res.items.slice(0, subsAmoun)),
      )
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(
      `${this.baseApiUrl}account/me`,
      profile
      )
  }

  uploadAvatar(file: File) {
    const fd = new FormData()
    fd.append('image', file)
    return this.http.post<File>(
      `${this.baseApiUrl}account/upload_image`,
    fd
  )
  }
  
  filterProfiles(params: Record<string, any>) {
    return this.http.get<Pageble<Profile>>(
      `${this.baseApiUrl}account/accounts`,
      {
        params
      }
    ).pipe(
      tap(res => this.filteredProfiles.set(res.items))
    )
  } 
}
