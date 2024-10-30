import { Component, HostListener, OnInit, inject, input, signal, ElementRef } from '@angular/core';
import { Post, PostComment } from '../../../data/interfaces/post.interface';
import { AvatarCircleComponent } from "../../../common-ui/avatar-circle/avatar-circle.component";
import { PostService } from '../../../data/services/post.service';
import { firstValueFrom } from 'rxjs';
import {DatePipe} from "@angular/common";
import { SvgIconComponent } from "../../../common-ui/svg-icon/svg-icon.component";
import { PostInputComponent } from "../post-input/post-input.component";
import { CommentComponent } from "./comment/comment.component";
import {DatePostPipe} from "../../../helpers/pipes/date-post.pipe";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe, SvgIconComponent, PostInputComponent, CommentComponent, DatePostPipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{
  post = input<Post>()
  postService = inject(PostService)
  comment = signal<PostComment[]>([])
  isBurgerMenuOpened = signal<boolean>(false)
  
  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isBurgerMenuOpened() && !this.eRef.nativeElement.querySelector('.burgerButton').contains(event.target)) {
      this.isBurgerMenuOpened.set(false)
    }
  }


  onDeletePost(id: number) {
    firstValueFrom(this.postService.deletePost(id))
  }

  async ngOnInit() {
    const comments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id))
    this.comment.set(comments)
  }
}
