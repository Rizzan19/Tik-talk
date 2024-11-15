import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Feature, MockService } from '../../data/services/mock.service';
import { KeyValuePipe } from '@angular/common';

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}

interface Address {
  city?: string;
  street?: string;
  building?: number;
  apartment?: number;
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
  });
}

@Component({
  selector: 'app-forms-experimental',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, KeyValuePipe],
  templateUrl: './forms-experimental.component.html',
  styleUrl: './forms-experimental.component.scss',
})
export class FormsExperimentalComponent {
  #fb = inject(FormBuilder);

  mockService = inject(MockService);
  features: Feature[] = [];

  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    name: new FormControl<string>('', Validators.required),
    inn: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
  });

  constructor() {
    this.mockService
      .getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe((addresses) => {
        this.form.controls.addresses.clear();
        for (const address of addresses) {
          this.form.controls.addresses.push(getAddressForm(address));
        }
      });

    this.mockService
      .getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;
        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          );
        }
      });

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((val) => {
        this.form.controls.inn.clearValidators();
        if (val === ReceiverType.LEGAL) {
          this.form.controls.inn.setValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ]);
        }
      });
  }

  addAddress() {
    this.form.controls.addresses.insert(0, getAddressForm());
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index, { emitEvent: false });
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    console.log(this.form.value);
    console.log(this.form.valid);
  }

  protected readonly ReceiverType = ReceiverType;

  sort = () => 0;
}

// form = this.#fb.group({
//   type: this.#fb.control<ReceiverType>(ReceiverType.PERSON),
//   name: this.#fb.control<string>(''),
//   inn: this.#fb.control<string>(''),
//   lastName: this.#fb.control<string>(''),
//   address: this.#fb.group({
//     city: this.#fb.control<string>(''),
//     street: this.#fb.control<string>(''),
//     building: this.#fb.control<number | null>(null),
//     apartment: this.#fb.control<number | null>(null)
//   })
// })
