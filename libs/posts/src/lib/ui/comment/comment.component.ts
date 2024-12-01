import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {AvatarCircleComponent} from '@tt/common-ui';
import {DatePipe} from '@angular/common';
import {PostComment} from "@tt/data-access/posts";

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  comment = input<PostComment>();
}
