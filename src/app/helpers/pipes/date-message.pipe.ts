import {PipeTransform, Pipe} from "@angular/core";
import {DateTime} from "luxon";

@Pipe({
    name: 'dateMessage',
    standalone: true,
})
export class DateMessagePipe implements PipeTransform {
    transform(value: string): string | null {
        const timeZone = DateTime.local().offset / 60
        const dt = DateTime.fromISO(value).plus({hours: timeZone})
        return dt.toFormat('HH:mm')
    }
}