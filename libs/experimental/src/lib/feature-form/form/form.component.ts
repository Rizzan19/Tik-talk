import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Feature, FormService } from './form.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KeyValuePipe, DatePipe } from '@angular/common';
import { DateTime } from 'luxon';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoOptions } from '@maskito/core';
import mask from './mask';
import { NameValidator } from './name.validator';

enum DeliveryType {
  COURIER = 'COURIER',
  PICKUP = 'PICKUP',
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

function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.toLowerCase().startsWith(forbiddenLetter)
      ? {
          startsWith: {
            message: `${forbiddenLetter} - недопустим для начала ввода`,
          },
        }
      : null;
  };
}

function validateDateRange({
  fromControlName,
  toControlName,
}: {
  fromControlName: string;
  toControlName: string;
}) {
  return (control: AbstractControl) => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);

    if (!fromControl || !toControl) return null;

    const fromDate = new Date(fromControl.value);
    const toDate = new Date(toControl.value);

    if (fromDate && toDate && fromDate > toDate) {
      toControl.setErrors({
        dateRange: { message: 'Дата начала не может быть позднее даты конца' },
      });
      return {
        dateRange: { message: 'Дата начала не может быть позднее даты конца' },
      };
    }
    return null;
  };
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, DatePipe, MaskitoDirective],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  days = 2;
  features: Feature[] = [];

  isActiveBtn = signal<string>('first');
  maxAddress = signal<boolean>(false);
  dateDelivery = signal<string>(
    DateTime.now()
      .plus({ day: this.days })
      .setLocale('ru')
      .toFormat('EEEE, d MMMM')
  );

  formService = inject(FormService);
  nameValidator = inject(NameValidator);

  readonly options: MaskitoOptions = mask;

  form = new FormGroup({
    firstName: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
      updateOn: 'blur',
    }),
    lastName: new FormControl<string>('', Validators.required),
    phone: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(16),
      Validators.minLength(16),
    ]),
    deliveryType: new FormControl<DeliveryType>(DeliveryType.PICKUP),
    address: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup(
      {
        from: new FormControl<string>(''),
        to: new FormControl<string>(''),
      },
      validateDateRange({ fromControlName: 'from', toControlName: 'to' })
    ),
  });

  constructor() {
    this.formService
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

    this.formService
      .getAddress()
      .pipe(takeUntilDestroyed())
      .subscribe((addresses) => {
        this.form.controls.address.clear();
        for (const address of addresses) {
          this.form.controls.address.push(getAddressForm(address));
        }
      });
  }

  onCheckboxChange(value: string) {
    if (value === 'fast') {
      if (this.days === 2) {
        this.dateDelivery.set(
          DateTime.now()
            .plus({ day: (this.days = 1) })
            .setLocale('ru')
            .toFormat('EEEE, d MMMM')
        );
      } else {
        this.dateDelivery.set(
          DateTime.now()
            .plus({ day: (this.days = 2) })
            .setLocale('ru')
            .toFormat('EEEE, d MMMM')
        );
      }
    }
  }

  addAddress() {
    if (this.form.controls.address.length === 3) {
      return this.maxAddress.set(true);
    }
    // @ts-ignore
    this.form.controls.address.insert(0, getAddressForm());
  }

  removeAddress(index: number) {
    if (this.form.controls.address.length === 3) this.maxAddress.set(false);
    this.form.controls.address.removeAt(index, { emitEvent: false });
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    console.log(this.form.valid);
    console.log(this.form.value);
  }

  sort = () => 0;
  protected readonly DeliveryType = DeliveryType;
  protected readonly validateDateRange = validateDateRange;
}
