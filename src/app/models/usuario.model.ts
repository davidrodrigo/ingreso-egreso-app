export class Usuario {
  uid: string;
  nombre: string;
  email: string;
  static fromFirebase({ email, uid, nombre }) {
    return new Usuario(uid, nombre, email);
  }
  constructor(uid: string, nombre: string, email: string) {
    this.uid = uid;
    this.nombre = nombre;
    this.email = email;
  }
}
