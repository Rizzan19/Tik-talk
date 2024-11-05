import {inject, Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Chat, LastMessageRes, Message} from "../interfaces/chat.interface";
import {map} from "rxjs";
import {ProfileService} from "./profile.service";

@Injectable({
    providedIn: 'root',
})
export class ChatsService {
    http = inject(HttpClient)
    me = inject(ProfileService).me

    activeChatMessages = signal<Message[]>([])

    baseApiUrl = 'https://icherniakov.ru/yt-course/'

    createChat(userId: number) {
        return this.http.post<Chat>(`${this.baseApiUrl}chat/${userId}`, {})
    }

    getMyChats() {
        return this.http.get<LastMessageRes[]>(`${this.baseApiUrl}chat/get_my_chats/`)
    }

    getChatById(chatId: number) {
        return this.http.get<Chat>(`${this.baseApiUrl}chat/${chatId}`)
            .pipe(
                map(chat => {
                    const patchedMessages = chat.messages.map(message => {
                        return {
                            ...message,
                            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
                            isMine: message.userFromId === this.me()!.id,
                        }
                    })

                    this.activeChatMessages.set(patchedMessages)

                    return {
                        ...chat,
                        companion: chat.userFirst.id === this.me()?.id ? chat.userSecond : chat.userFirst,
                        messages: patchedMessages
                    }
                })
            )
    }


    sendMessage(chatId: number, message: string) {
        return this.http.post<Message>(`${this.baseApiUrl}message/send/${chatId}`, {}, {
            params: {
                message
            }
        })
    }
}