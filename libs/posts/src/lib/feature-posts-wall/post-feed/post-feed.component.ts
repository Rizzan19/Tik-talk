import {Component, ElementRef, Renderer2, inject, ViewChild} from '@angular/core';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import {postActions, selectPosts} from '../../data';
import { audit, fromEvent, interval } from 'rxjs';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  @ViewChild('postsWrapper') postsWrapper!: ElementRef

  store = inject(Store)
  r2 = inject(Renderer2);

  feed = this.store.selectSignal(selectPosts)

  constructor() {
    this.store.dispatch(postActions.fetchPosts({}))
  }

  ngAfterViewInit() {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(audit(() => interval(50)))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  resizeFeed() {
    const { top } = this.postsWrapper.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 48;

    this.r2.setStyle(this.postsWrapper.nativeElement, 'height', `${height}px`);
  }
}
