import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Router} from '@angular/router';
// @ts-ignore
import {SvgIconComponent} from '@tt/common-ui'
// @ts-ignore
import {TtInputComponent} from '@tt/common-ui'
// @ts-ignore
import {AuthService} from "@tt/data-access/auth"
// @ts-ignore

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, SvgIconComponent, TtInputComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  handleSubmit() {
    if (this.form.valid) {
      //@ts-ignore
      this.authService.login(this.form.value).subscribe((res) => {
        this.router.navigate(['/']);
      });
    }
  }
}
