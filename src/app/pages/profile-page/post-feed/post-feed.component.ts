import { Component, ElementRef, HostListener, Renderer2, inject } from '@angular/core';
import { PostInputComponent } from "../post-input/post-input.component";
import { PostComponent } from "../post/post.component";
import { PostService } from '../../../data/services/post.service';
import { audit, debounce, firstValueFrom, fromEvent, interval, throttle } from 'rxjs';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
  postService = inject(PostService) 
  feed = this.postService.posts

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed()
  }

  hostElement = inject(ElementRef)
  r2 = inject(Renderer2)

  constructor() {
    firstValueFrom(this.postService.fetchPosts())
  }

  ngAfterViewInit() {
    this.resizeFeed()
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect()

    const height = window.innerHeight - top - 24 - 24

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
  }
}
