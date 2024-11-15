import { PipeTransform, Pipe } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'datePost',
  standalone: true,
})
export class DatePostPipe implements PipeTransform {
  transform(value: string): string | null {
    const dt = DateTime.fromISO(value, { zone: 'utc' }).setZone(
      DateTime.local().zone
    );
    return dt.toRelative() || '';
  }
}
