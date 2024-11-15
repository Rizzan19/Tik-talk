import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Feature {
  code: string;
  label: string;
  value: boolean;
}

@Injectable({ providedIn: 'root' })
export class FormService {
  getAddress() {
    return of([
      {
        city: 'Санкт-Петербург',
        street: 'Ленсовета',
        building: 52,
        apartment: 33,
      },
    ]);
  }

  getFeatures(): Observable<Feature[]> {
    return of([
      {
        code: 'strong-package',
        label: 'Пупырчатая пленка',
        value: false,
      },
      {
        code: 'fast',
        label: 'Ускоренная доставка',
        value: false,
      },
    ]);
  }
}
