import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  private sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  transform(value: any, args?: any): any {
    let index = 0;
    if (value) {
      if (typeof value === 'string') {
        value = parseInt(value, 10);
      }
      while (value > 1024) {
        index++;
        value = value / 1024;
      }
      return value.toFixed(2) + ' ' + this.sizes[index];
    }
    return '0';
  }

}
