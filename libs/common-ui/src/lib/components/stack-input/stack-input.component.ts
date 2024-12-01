import {Component, forwardRef, HostBinding, HostListener, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'tt-stack-input',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, FormsModule],
  templateUrl: './stack-input.component.html',
  styleUrl: './stack-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StackInputComponent),
    multi: true,
  }]
})
export class StackInputComponent implements ControlValueAccessor {
  @Input() key: string = 'space'

  value$ = new BehaviorSubject<string[]>([]);

  #disabled = false

  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this.#disabled
  }

  innerInput = ''


  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key.toLowerCase() === this.key.toLowerCase()) {
      event.stopPropagation()
      event.preventDefault()
      if (!this.innerInput) return

      this.value$.next([...this.value$.value, this.innerInput])
      this.innerInput = ''
      this.onChange(this.value$.value)
    }
  }

  writeValue(stack: string[] | null): void {
    if (!stack) {
      this.value$.next([])
      return
    }

    this.value$.next(stack)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.#disabled = isDisabled
  }

  onChange(val: string[] | null) {}

  onTouched() {}


  onTagDelete(index: number) {
    const tags = this.value$.value
    tags.splice(index, 1)
    this.value$.next(tags)
    this.onChange(this.value$.value)
  }
}
