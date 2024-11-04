import {Component, Input} from '@angular/core';
import {Profile} from "../../data/interfaces/profile.interface";
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ImgUrlPipe, SvgIconComponent, RouterLink],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
