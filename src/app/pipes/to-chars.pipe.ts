import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toChars'
})
export class ToCharsPipe implements PipeTransform {

  transform(value: string, from?: number, length?: number): any {
    if (value) {
      return value.substr(from, length);
    }
    return null;
  }

}
