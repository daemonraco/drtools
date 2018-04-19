import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'boolean'
})
export class BooleanPipe implements PipeTransform {
    transform(value: boolean, args?: any): any {
        console.log(`DEBUG`, JSON.stringify(args, null, 2));
        let out: string = '';

        switch (args.toLowerCase()) {
            case 'icon':
                out = value ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                break;
            case 'text':
                out = value ? 'yes' : 'no';
                break;
            default:
                out = value ? 'true' : 'false';
                break;
        }

        return out;
    }
}
