import {Component, ElementRef, inject, input, Renderer2} from '@angular/core';
import {ChatWorkspaceMessageComponent} from "./chat-workspace-message/chat-workspace-message.component";
import {MessageInputComponent} from "../../../../common-ui/message-input/message-input.component";
import {ChatsService} from "../../../../data/services/chats.service";
import {Chat} from "../../../../data/interfaces/chat.interface";
import {audit, firstValueFrom, fromEvent, interval, map, timer} from "rxjs";

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [
    ChatWorkspaceMessageComponent,
    MessageInputComponent
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatsService = inject(ChatsService)
  elRef = inject(ElementRef)
  r2 = inject(Renderer2)

  chat = input.required<Chat>()

  messages = this.chatsService.activeChatMessages

  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatsService.sendMessage(this.chat().id, messageText))

    await firstValueFrom(this.chatsService.getChatById(this.chat().id))
    
    this.scrollBottom()
  }

  async updateChat () {
    await firstValueFrom(this.chatsService.getChatById(this.chat().id))
  }


  ngAfterViewInit() {
    this.resizeMessages()
    this.scrollBottom()

    timer(5000, 5000).subscribe(() => this.updateChat())

    fromEvent(window, 'resize')
        .pipe(
            audit(() => interval(50))
        )
        .subscribe(() => {
          this.resizeMessages()
        })
  }

  resizeMessages() {
    const {top} = this.elRef.nativeElement.getBoundingClientRect()

    const width = this.elRef.nativeElement.offsetWidth - 26

    const height = window.innerHeight - top - 130

    this.r2.setStyle(this.elRef.nativeElement, 'height', `${height}px`)
    this.r2.setStyle(this.elRef.nativeElement.querySelector('app-message-input'), 'width', `${width}px`)
  }

  scrollBottom() {
    this.elRef.nativeElement.scrollTop = this.elRef.nativeElement.scrollHeight
  }
}
