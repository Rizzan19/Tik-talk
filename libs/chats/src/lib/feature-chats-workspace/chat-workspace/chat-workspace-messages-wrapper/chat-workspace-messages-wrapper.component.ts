import {Component, ElementRef, inject, input, Renderer2} from '@angular/core';
import {ChatWorkspaceMessageComponent} from './chat-workspace-message/chat-workspace-message.component';
import {MessageInputComponent} from '../../../ui';
import {ChatsService} from '../../../data/services/chats.service';
import {Chat} from '../../../data/interfaces/chat.interface';
import {audit, fromEvent, interval} from 'rxjs';
import {KeyValuePipe} from '@angular/common';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent, KeyValuePipe],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatsService = inject(ChatsService);
  elRef = inject(ElementRef);
  r2 = inject(Renderer2);

  chat = input.required<Chat>();

  messages = this.chatsService.activeChatMessages;

  onSendMessage(messageText: string) {
    this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id)
  }

  scrollBottom() {
    this.elRef.nativeElement.scrollTop = this.elRef.nativeElement.scrollHeight;
  }

  ngAfterViewChecked() {
    this.scrollBottom()
  }

  ngOnInit() {
    this.resizeMessages();
  }

  ngAfterViewInit() {
    fromEvent(window, 'resize')
      .pipe(audit(() => interval(50)))
      .subscribe(() => {
        this.resizeMessages();
      });
  }

  resizeMessages() {
    const { top } = this.elRef.nativeElement.getBoundingClientRect();

    const width = this.elRef.nativeElement.offsetWidth - 36;

    const height = window.innerHeight - top - 130;

    this.r2.setStyle(this.elRef.nativeElement, 'height', `${height}px`);
    this.r2.setStyle(
      this.elRef.nativeElement.querySelector('app-message-input'),
      'width',
      `${width}px`
    );
  }
}
