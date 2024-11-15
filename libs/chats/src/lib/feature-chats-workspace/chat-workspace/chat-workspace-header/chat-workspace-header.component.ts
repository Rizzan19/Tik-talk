import { Component, input } from '@angular/core';
import { Profile } from '../../../../../../interfaces/src/lib/profile/profile.interface';
import { AvatarCircleComponent } from '../../../../../../common-ui/src/lib/components/avatar-circle/avatar-circle.component';
import { SvgIconComponent } from '../../../../../../common-ui/src/lib/components/svg-icon/svg-icon.component';

@Component({
  selector: 'app-chat-workspace-header',
  standalone: true,
  imports: [AvatarCircleComponent, SvgIconComponent],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss',
})
export class ChatWorkspaceHeaderComponent {
  profile = input.required<Profile>();
}
