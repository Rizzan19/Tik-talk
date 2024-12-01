import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, inject, input, OnInit} from '@angular/core';
import {AvatarCircleComponent} from '@tt/common-ui';
import {DatePipe} from '@angular/common';
import {Chat, Message} from "@tt/data-access/chats";
import {ProfileService} from "@tt/data-access/profile";

@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>();
  chat = input.required<Chat>();
  me = inject(ProfileService).me


  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().userFromId === this.me()?.id;
  }
}
