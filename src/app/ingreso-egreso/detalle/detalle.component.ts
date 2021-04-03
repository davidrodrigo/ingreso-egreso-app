import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../../models/ingreso-egreso-model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})

export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos = new  Array<IngresoEgreso>();
  ingresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.ingresosSubs = this.store.select('ingresosEgresos').subscribe(({items}) => this.ingresosEgresos = items);
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

  borrar(uid: string): void {
    if(uid) {
      this.ingresoEgresoService.borrarIngresoEgreso(uid)
        .then(() => {
          Swal.fire('Borrado', 'Item Borrado', 'success');
        })
        .catch(err => {
          Swal.fire('Error', err.message, 'error');
        })
    }
  }

}
