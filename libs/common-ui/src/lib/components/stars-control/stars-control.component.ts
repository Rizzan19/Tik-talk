import {Component, forwardRef, input, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";


@Component({
  selector: 'tt-stars-control',
  standalone: true,
  templateUrl: './stars-control.component.html',
  styleUrl: './stars-control.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => StarsControlComponent)
  }]
})
export class StarsControlComponent implements ControlValueAccessor {
  maxStars = input<number>(5)
  disabled = signal<boolean>(false)

  onChange: any
  onTouched: any
  value = 0
  hoverRating = 0

  get stars() {
    return Array(this.maxStars()).fill(0)
  }

  hover(num: number) {
    this.hoverRating = num
  }

  rate(num: number) {
    this.value = num
    this.onChange(this.value)
    this.onTouched()
  }

  writeValue(val: number): void {
    return
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled)
  }
}
