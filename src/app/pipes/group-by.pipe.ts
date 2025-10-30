import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy',
  standalone: false
})
export class GroupByPipe implements PipeTransform {

  transform(collection: any[], property: string): any[] {
    if (!collection) return [];
    const grouped = collection.reduce((groups, item) => {
      const key = item[property];
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});
    return Object.keys(grouped).map(key => ({ key, value: grouped[key] }));
  }

}
