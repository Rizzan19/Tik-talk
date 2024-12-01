import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn} from "@angular/forms";
import {StarsControlComponent} from "@tt/common-ui";
import {Router} from "@angular/router";

function validateRatingControl(): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value === 0
        ? {
            zeroValue: {
              message: `Необходимо выбрать оценку!`,
            },
        }
        : null
  }
}

@Component({
  selector: 'tt-form-success',
  standalone: true,
  imports: [CommonModule, StarsControlComponent, ReactiveFormsModule],
  templateUrl: './form-success.component.html',
  styleUrl: './form-success.component.scss',
})
export class FormSuccessComponent {
  router = inject(Router)

  formRating = new FormGroup({
    rating: new FormControl(0, validateRatingControl()),
  })

  handleSubmit() {
    this.formRating.markAllAsTouched()
    this.formRating.updateValueAndValidity()

    if (this.formRating.invalid) return
    this.router.navigate(['form'])
  }
}
