import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso-model';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform(items: Array<IngresoEgreso>): Array<IngresoEgreso> {
    if (items && items.length > 0) {
      return items.slice().sort((a, b) => a.tipo === 'ingreso' ? -1 : 1);
    }
  }

}
