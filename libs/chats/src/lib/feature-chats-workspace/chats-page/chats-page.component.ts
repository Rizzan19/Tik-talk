import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatsListComponent} from '../chats-list/chats-list.component';
import {ChatsService} from "@tt/chats";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-chats-page',
  standalone: true,
  imports: [RouterOutlet, ChatsListComponent],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss',
})
export class ChatsPageComponent {
  #chatsService = inject(ChatsService);

// constructor() {
  // this.#chatsService.connectWs()
  //     .pipe(takeUntilDestroyed())
  //     .subscribe()
  // }
}
