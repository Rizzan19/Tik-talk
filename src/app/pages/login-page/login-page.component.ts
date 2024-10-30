import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, SvgIconComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  authServise = inject(AuthService)
  router = inject(Router)

  isPasswordVisible = signal<boolean>(false)

  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  })



  handleSubmit() {
    if (this.form.valid) {
      //@ts-ignore
      this.authServise.login(this.form.value)
        .subscribe(res => {
          this.router.navigate(['/'])
          console.log(res)
        })
    }
  }
}
