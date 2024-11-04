import {Component, ElementRef, inject, Renderer2} from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';
import { RouterLink } from '@angular/router';
import { ProfileFiltersComponent } from './profile-filters/profile-filters.component';
import { AsyncPipe } from '@angular/common';
import {audit, fromEvent, interval} from "rxjs";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, RouterLink, ProfileFiltersComponent, AsyncPipe],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  profileService = inject(ProfileService)
  profiles = this.profileService.filteredProfiles

  hostElement = inject(ElementRef)
  r2 = inject(Renderer2)

  ngAfterViewInit() {
    this.resizeWindow()
    fromEvent(window, 'resize')
        .pipe(
            audit(() => interval(50))
        )
        .subscribe(() => {
          this.resizeWindow()
        })
  }

  resizeWindow() {
    const {top} = this.hostElement.nativeElement.querySelector('.profile-card__wrapper').getBoundingClientRect();

    const height = window.innerHeight - top - 30

    this.r2.setStyle(this.hostElement.nativeElement.querySelector('.profile-card__wrapper'), 'height', `${height}px`);
  }
}
