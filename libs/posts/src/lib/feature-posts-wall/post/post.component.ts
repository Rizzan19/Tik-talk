import {
  Component,
  HostListener,
  OnInit,
  inject,
  input,
  signal,
  ElementRef,
} from '@angular/core';
import { Post, PostComment, PostService } from '../../data';
import { PostInputComponent, CommentComponent } from '../../ui';
import { AvatarCircleComponent, SvgIconComponent, DatePostPipe } from '@tt/common-ui';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    DatePostPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();
  postService = inject(PostService);
  comment = signal<PostComment[]>([]);
  isBurgerMenuOpened = signal<boolean>(false);

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (
      this.isBurgerMenuOpened() &&
      !this.eRef.nativeElement
        .querySelector('.burgerButton')
        .contains(event.target)
    ) {
      this.isBurgerMenuOpened.set(false);
    }
  }

  onDeletePost(id: number) {
    firstValueFrom(this.postService.deletePost(id));
  }

  async ngOnInit() {
    const comments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id)
    );
    this.comment.set(comments);
  }
}
