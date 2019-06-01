import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageName'
})
export class ImageNamePipe implements PipeTransform {

  transform(value: Array<string>, args?: any): any {
    if (value && value.length > 0) {
      const tag = value[0];
      return tag.split(':')[0];
    }
    return null;
  }

}
