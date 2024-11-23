import {Component, HostBinding, inject, input, OnInit, signal} from '@angular/core';
import {Chat, Message} from '../../../../data/interfaces/chat.interface';
import {AvatarCircleComponent} from '@tt/common-ui';
import {DatePipe} from '@angular/common';
import {Profile} from "@tt/interfaces/profile";
import {ProfileService} from "@tt/profile";

@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
})
export class ChatWorkspaceMessageComponent implements OnInit {
  message = input.required<Message>();
  chat = input.required<Chat>();
  me = inject(ProfileService).me
  user = signal<Profile | null>(null)

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().userFromId === this.me()?.id;
  }

  ngOnInit() {
    this.message().isMine
        ? this.user.set(this.me())
        : (this.chat().userFirst.id === this.me()?.id
            ? this.user.set(this.chat().userSecond)
            : this.user.set(this.chat().userFirst))
  }
}
