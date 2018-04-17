import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys'
})
export class KeysPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        return typeof value === 'object' ? Object.keys(value).sort().join(', ') : '';
    }
}
