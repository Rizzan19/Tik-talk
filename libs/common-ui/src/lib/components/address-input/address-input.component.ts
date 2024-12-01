import {Component, forwardRef, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {DadataService} from "@tt/data-access/common-ui";
import {TtInputComponent} from "../tt-input/tt-input.component";
import {debounceTime, switchMap, tap} from "rxjs";
import {DadataSuggestion} from "@tt/data-access/common-ui/interfaces/dadata.interface";

@Component({
  selector: 'tt-address-input',
  standalone: true,
  imports: [CommonModule, TtInputComponent, ReactiveFormsModule],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AddressInputComponent),
    multi: true
  }]
})
export class AddressInputComponent implements ControlValueAccessor {
  innerSearchControl = new FormControl()
  #dadataService = inject(DadataService)

  isDropdownOpened = signal<boolean>(false)

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl(''),
  })

  suggestions$ = this.innerSearchControl.valueChanges
      .pipe(
          debounceTime(500),
          switchMap(val => {
            return this.#dadataService.getSuggestion(val)
                .pipe(
                    tap(res => {
                      this.isDropdownOpened.set(!!res.length)
                    })
                )
          })
      )

  writeValue(city: string | null): void {
    this.innerSearchControl.patchValue(city, {
      emitEvent: false
    })
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
  }

  onChange(city: string) {}
  onTouched() {}

  onSuggestionPick(suggest: DadataSuggestion) {
    this.addressForm.patchValue({
      city: suggest.data.city,
      street: suggest.data.street,
      building: suggest.data.house,
    })
    this.isDropdownOpened.set(false)
    // this.innerSearchControl.patchValue(city, {
    //   emitEvent: false
    // })
    // this.onChange(city)

  }
}
