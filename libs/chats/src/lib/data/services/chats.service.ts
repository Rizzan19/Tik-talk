import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat, LastMessageRes, Message } from '../interfaces/chat.interface';
import { map } from 'rxjs';
import { ProfileService } from '@tt/profile';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  activeChatMessages = signal<Map<string, Message[]>>(new Map());

  baseApiUrl = 'https://icherniakov.ru/yt-course/';

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

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${this.baseApiUrl}message/send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }

  daysOfMessages(messages: Message[]): Map<string, Message[]> {
    const groupedMessages = new Map<string, Message[]>();

    const today = DateTime.now().startOf('day');
    const yesterday = today.minus({ day: 1 });

    messages.forEach((message) => {
      const day = DateTime.fromISO(message.createdAt, { zone: 'utc' })
        .setZone(DateTime.local().zone)
        .startOf('day');
      let labelDay = '';
      if (day.equals(today)) {
        labelDay = 'Сегодня';
      } else if (day.equals(yesterday)) {
        labelDay = 'Вчера';
      } else {
        labelDay = day.toFormat('dd.MM.yyyy');
      }
      if (!groupedMessages.has(labelDay)) {
        groupedMessages.set(labelDay, []);
      }
      groupedMessages.get(labelDay)!.push(message);
    });
    return groupedMessages;
  }
}
