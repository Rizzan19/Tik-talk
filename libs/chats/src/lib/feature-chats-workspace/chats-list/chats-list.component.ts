import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {filter, map, startWith, switchMap} from 'rxjs';
import {SvgIconComponent} from "@tt/common-ui";
import {ChatsService, LastMessageRes} from "@tt/data-access/chats";

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    FormsModule,
    ReactiveFormsModule,
    SvgIconComponent,
    AsyncPipe,
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ChatsListComponent {
  chatsService = inject(ChatsService);

  activeChats = signal<LastMessageRes[]>([])

  filterChartsControl = new FormControl('');

  chats$ = this.chatsService.getMyChats().pipe(
    switchMap((chats) => {
      this.activeChats.set(chats)
      return this.filterChartsControl.valueChanges.pipe(
        startWith(''),
        map((inputValue) => {
          return chats.reverse().filter((chat) => {
            if (chat.message === null) return
            return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
              .toLowerCase()
              .includes(inputValue?.toLowerCase() ?? '');
          });
        })
      );
    })
  );
}
