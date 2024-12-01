import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input} from '@angular/core';
import {AvatarCircleComponent, ImgUrlPipe} from '@tt/common-ui';
import {Profile} from "@tt/data-access/profile";

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [ImgUrlPipe, AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileHeaderComponent {
  profile = input<Profile>();
  cdr = inject(ChangeDetectorRef)

  constructor() {
    this.cdr.markForCheck()
  }
}
