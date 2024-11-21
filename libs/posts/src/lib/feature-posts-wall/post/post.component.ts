import {
  Component,
  HostListener,
  OnInit,
  inject,
  input,
  signal,
  ElementRef,
} from '@angular/core';
import {Post, postActions, PostComment, PostService} from '../../data';
import { PostInputComponent, CommentComponent } from '../../ui';
import { AvatarCircleComponent, SvgIconComponent, DatePostPipe } from '@tt/common-ui';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import {Store} from "@ngrx/store";

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
  store = inject(Store)
  eRef = inject(ElementRef)

  post = input<Post>();
  isBurgerMenuOpened = signal<boolean>(false);

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

  onDeletePost(postId: number) {
    this.store.dispatch(postActions.deletePost({postId: postId}))
  }

  ngOnInit() {}
}
