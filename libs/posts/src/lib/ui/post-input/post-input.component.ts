import {Component, HostBinding, inject, input, Renderer2,} from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import {NgIf} from '@angular/common';
import {postActions} from '@tt/data-access/posts';
import {FormsModule} from '@angular/forms';
import {Store} from "@ngrx/store";
import {GlobalStoreService} from "@tt/data-access/shared";

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  store = inject(Store)

  isCommentInput = input(false);
  postId = input<number>(0);
  profile = inject(GlobalStoreService).me

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  postText = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatePost() {
    if (!this.postText) return;

    if (this.isCommentInput()) {
      this.store.dispatch(postActions.createComment({payload: {
          text: this.postText,
          authorId: this.profile()!.id,
          postId: this.postId(),
          }}))
      this.postText = ''
      return;
    }

    this.store.dispatch(postActions.createPost({payload: {
      title: 'Клевый пост',
      content: this.postText,
      authorId: this.profile()!.id
    }}))
    this.postText = ''
  }
}
