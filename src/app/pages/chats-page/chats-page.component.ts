import { Component } from '@angular/core';
import {ChatWorkspaceComponent} from "./chat-workspace/chat-workspace.component";
import {RouterOutlet} from "@angular/router";
import {ChatsListComponent} from "./chats-list/chats-list.component";

@Component({
  selector: 'app-chats-page',
  standalone: true,
  imports: [
    ChatWorkspaceComponent,
    RouterOutlet,
    ChatsListComponent
  ],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {

}
