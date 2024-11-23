import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat, LastMessageRes, Message } from '../interfaces/chat.interface';
import {firstValueFrom, map, Observable} from 'rxjs';
import { ProfileService } from '@tt/profile';
import { DateTime } from 'luxon';
import {ChatWsService} from "../interfaces/chat-ws-service.interface";
import {ChatWsNativeService} from "./chat-ws-native.service";
import {AuthService} from "@tt/auth";
import {ChatWSMessage} from "../interfaces/chat-ws-message.interface";
import {isNewMessage, isUnreadMessage} from "../interfaces/type-guards";
import {ChatWsRxjsService} from "./chat-ws-rxjs.service";
import {GlobalStoreService} from "@tt/shared";

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;
  #authService = inject(AuthService)
  profileService = inject(ProfileService)


  wsAdapter: ChatWsService = new ChatWsRxjsService()

  unreadMessages = signal<number>(0)
  activeChatMessages = signal<Map<string, Message[]>>(new Map());

  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage
    }) as Observable<ChatWSMessage>
  }

  handleWSMessage = (message: ChatWSMessage) => {
    if (!('action' in message)) return

    if (isUnreadMessage(message)) {
      this.unreadMessages.set(message.data.count)
    }

    if (isNewMessage(message)) {
      const day = DateTime.now().startOf('day').toISODate()
      const labelDay = this.getLabelDay(day)

      if (!this.activeChatMessages().has(labelDay)) {
          this.activeChatMessages().set(labelDay, [])
      }
      this.activeChatMessages().get(labelDay)!.push({
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: message.data.created_at,
        isRead: false,
        isMine: true,
      })
    }

  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.baseApiUrl}chat/${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(
      `${this.baseApiUrl}chat/get_my_chats/`
    );
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.baseApiUrl}chat/${chatId}`).pipe(
      map((chat) => {
        let patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });
        //@ts-ignore
        patchedMessages = this.daysOfMessages(patchedMessages);
        // @ts-ignore
        this.activeChatMessages.set(patchedMessages);

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  daysOfMessages(messages: Message[]): Map<string, Message[]> {
    const groupedMessages = new Map<string, Message[]>();

    messages.forEach((message) => {
      const labelDay = this.getLabelDay(message.createdAt)
      if (!groupedMessages.has(labelDay)) {
        groupedMessages.set(labelDay, []);
      }
      groupedMessages.get(labelDay)!.push(message);
    });
    return groupedMessages;
  }

  getLabelDay(createdAt: string): string {
    const today = DateTime.now().startOf('day')
    const yesterday = today.minus({ day: 1 })
    const day = DateTime.fromISO(createdAt, { zone: 'utc' })
        .setZone(DateTime.local().zone)
        .startOf('day')

    if (day.equals(today)) {
      return  'Сегодня';
    } else if (day.equals(yesterday)) {
      return  'Вчера';
    } else {
      return day.toFormat('dd.MM.yyyy');
    }
  }
}
