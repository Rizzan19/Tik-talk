import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {profileActions, ProfileService} from '@tt/data-access/profile';
import {debounceTime, startWith} from 'rxjs';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent {
  fb = inject(FormBuilder);
  store = inject(Store)

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
      )
      .subscribe(formValue => {
        this.store.dispatch(profileActions.filterEvents({filters: formValue}))
      });
    // this.searchForm.patchValue(this.store.selectSignal(profileActions.filterEvents{}));
  }
}
