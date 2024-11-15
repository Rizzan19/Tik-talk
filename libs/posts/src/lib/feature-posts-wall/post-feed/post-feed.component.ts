import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../data';
import { audit, firstValueFrom, fromEvent, interval } from 'rxjs';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  postService = inject(PostService);
  feed = this.postService.posts;

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
    this.resizeFeed();
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
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
