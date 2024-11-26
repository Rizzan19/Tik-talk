import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {AvatarCircleComponent, ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {AsyncPipe, NgForOf} from '@angular/common';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {firstValueFrom, Subscription} from 'rxjs';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ChatsService} from "@tt/data-access/chats";
import {ProfileService} from "@tt/data-access/profile";
import {GlobalStoreService} from "@tt/data-access/shared"
import {AuthService} from "@tt/data-access/auth";
import {isErrorMessage} from "@tt/data-access/chats/interfaces/type-guards";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        SvgIconComponent,
        NgForOf,
        SubscriberCardComponent,
        RouterLink,
        RouterLinkActive,
        AsyncPipe,
        ImgUrlPipe,
        AvatarCircleComponent,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
    profileService = inject(ProfileService);
    #chatsService = inject(ChatsService);
    #authService = inject(AuthService);
    destroyRef = inject(DestroyRef)
    me = inject(GlobalStoreService).me


    unreadMessage = this.#chatsService.unreadMessages
    subscribers$ = this.profileService.getSubscribersShortList();

    wsSubscribe!: Subscription

    menuItems = [
        {
            label: 'Моя страница',
            icon: 'home',
            link: 'profile/me',
        },
        {
            label: 'Чаты',
            icon: 'chat',
            link: 'chats',
        },
        {
            label: 'Поиск',
            icon: 'search',
            link: 'search',
        },
    ];

    async reconnect() {
        await firstValueFrom(this.#authService.refreshAuthToken())
        console.log('Я безшумно рефрешнула токен')
        this.connection()
    }

    async connection() {
        await firstValueFrom(this.#authService.refreshAuthToken())
        this.wsSubscribe?.unsubscribe()
        this.wsSubscribe = this.#chatsService.connectWs()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((message) => {
                if (isErrorMessage(message)) {
                    this.reconnect()
                }
            })
    }

    ngOnInit() {
        firstValueFrom(this.profileService.getMe());

        this.connection()
    }
}
