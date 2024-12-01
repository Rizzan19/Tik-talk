import {ChangeDetectionStrategy, Component, effect, ElementRef, inject, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AvatarUploadComponent, ProfileHeaderComponent} from '../../ui';
import {ProfileService} from '@tt/data-access/profile';
import {firstValueFrom} from 'rxjs/internal/firstValueFrom';
import {AddressInputComponent, StackInputComponent, SvgIconComponent} from '@tt/common-ui';
import {AuthService} from "@tt/data-access/auth";
import {GlobalStoreService} from "@tt/data-access/shared";
import {audit, fromEvent, interval} from "rxjs";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ProfileHeaderComponent,
    AvatarUploadComponent,
    SvgIconComponent,
    StackInputComponent,
    AddressInputComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  me = inject(GlobalStoreService).me
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
    city: [null],
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {

      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    firstValueFrom(
    //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
      })
    )
  }

  ngAfterViewInit() {
    this.resizeWindow();
    fromEvent(window, 'resize')
        .pipe(audit(() => interval(50)))
        .subscribe(() => {
          this.resizeWindow();
        });
  }

  resizeWindow() {
    const { top } = this.hostElement.nativeElement
        .querySelector('.profile-form__wrapper')
        .getBoundingClientRect();

    const height = window.innerHeight - top - 30;

    this.r2.setStyle(
        this.hostElement.nativeElement.querySelector('.profile-form__wrapper'),
        'height',
        `${height}px`
    );
  }
}
