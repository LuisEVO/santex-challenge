import { Pipe, PipeTransform } from '@angular/core';
import { truthyKeysToString } from '../utils/truthy-keys-to-string.util';

@Pipe({
  name: 'truthyKeysToString',
  standalone: true
})
export class TruthyKeysToStringPipe implements PipeTransform {

  transform(value: object | undefined): string {
    return value ? truthyKeysToString(value) : '';
  }

}
