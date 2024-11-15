import { Component, Input } from '@angular/core';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { RouterLink } from '@angular/router';
import { Profile } from "@tt/interfaces/profile";

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ImgUrlPipe, SvgIconComponent, RouterLink],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
