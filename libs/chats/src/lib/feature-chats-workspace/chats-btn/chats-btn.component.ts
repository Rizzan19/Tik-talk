import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import {AvatarCircleComponent} from "@tt/common-ui";
import {LastMessageRes} from "../../data/interfaces/chat.interface";

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent{
  chat = input<LastMessageRes>();
}
