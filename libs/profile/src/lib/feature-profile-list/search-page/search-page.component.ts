import {ChangeDetectionStrategy, Component, ElementRef, inject, Renderer2} from '@angular/core';
import {profileActions, selectFilteredProfiles} from '@tt/data-access/profile';
import {ProfileCardComponent} from '../../ui';
import {RouterLink} from '@angular/router';
import {ProfileFiltersComponent} from '../profile-filters/profile-filters.component';
import {AsyncPipe} from '@angular/common';
import {audit, fromEvent, interval} from 'rxjs';
import {Store} from "@ngrx/store";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    ProfileCardComponent,
    RouterLink,
    ProfileFiltersComponent,
    AsyncPipe,
    InfiniteScrollDirective,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
  store = inject(Store);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  profiles = this.store.selectSignal(selectFilteredProfiles);

  ngAfterViewInit() {
    this.resizeWindow();
    fromEvent(window, 'resize')
      .pipe(audit(() => interval(50)))
      .subscribe(() => {
        this.resizeWindow();
      });
  }

  resizeWindow() {
    const { top } = this.hostElement.nativeElement
      .querySelector('.profile-card__wrapper')
      .getBoundingClientRect();

    const height = window.innerHeight - top - 30;

    this.r2.setStyle(
      this.hostElement.nativeElement.querySelector('.profile-card__wrapper'),
      'height',
      `${height}px`
    );
  }

  onScroll() {
    console.log('scroll')
    this.timeToFetch()
  }

  timeToFetch() {
    this.store.dispatch(profileActions.setPage({}))
  }
}
