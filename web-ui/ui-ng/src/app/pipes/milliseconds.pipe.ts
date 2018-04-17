import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'milliseconds'
})
export class MillisecondsPipe implements PipeTransform {
    transform(value: number, args?: any): any {
        return Math.round(value / 10) / 100;
    }
}
