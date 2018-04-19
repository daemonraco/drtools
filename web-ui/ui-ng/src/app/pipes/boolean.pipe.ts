import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'boolean'
})
export class BooleanPipe implements PipeTransform {
    transform(value: boolean, args?: any): any {
        return value ? 'true' : 'false';
    }
}
