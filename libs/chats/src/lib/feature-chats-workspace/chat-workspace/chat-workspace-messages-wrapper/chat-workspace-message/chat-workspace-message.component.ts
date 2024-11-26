import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  inject,
  input,
  OnInit,
  signal
} from '@angular/core';
import {AvatarCircleComponent} from '@tt/common-ui';
import {DatePipe} from '@angular/common';
import {Chat, Message} from "@tt/data-access/chats";
import {Profile, ProfileService} from "@tt/data-access/profile";

@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessageComponent implements OnInit {
  message = input.required<Message>();
  chat = input.required<Chat>();
  me = inject(ProfileService).me
  user = signal<Profile | null>(null)
  cdr = inject(ChangeDetectorRef)

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
