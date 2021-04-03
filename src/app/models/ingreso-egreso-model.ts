export class IngresoEgreso {
  descripcion: string;
  monto: number;
  tipo: string;
  uid?: string;
  constructor(descripcion: string, monto: number, tipo: string, uid?: string) {
    this.descripcion = descripcion;
    this.monto = monto;
    this.tipo = tipo;
    // this.uid = uid;
  }
}
