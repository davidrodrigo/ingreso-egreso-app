import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso-model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as ui from '../shared/ui.actions';
import { AppState } from '../app.reducer';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  uiSubscription: Subscription;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
    ) {
      this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
    }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  guardar(): void {
    this.store.dispatch(ui.isLoading());
    if(this.ingresoForm.valid) {
      const {descripcion, monto} = this.ingresoForm.value;
      const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
      this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
        .then(ref => {
          this.ingresoForm.reset();
          this.store.dispatch(ui.stopLoading());
          Swal.fire('Registro creado', descripcion, 'success');
        })
        .catch(err => {
          Swal.fire('Error', err.message, 'success');
          this.store.dispatch(ui.stopLoading());
        });
    }
  }

}
