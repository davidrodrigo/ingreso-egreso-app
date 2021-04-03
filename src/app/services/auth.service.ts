import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  fireStoreSub: Subscription;
  private _user: Usuario;

  get user() {
    return {...this._user};
  }

  constructor(
    private auth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private store: Store<AppState>
  ) {
  }

  initAuthListener() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.fireStoreSub = this.fireStore.doc(`${user.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {
            const newUser = Usuario.fromFirebase(firestoreUser);
            this._user = newUser;
            this.store.dispatch(authActions.setUser({user: newUser}));
          });
      } else {
        if (this.fireStoreSub) {
          this.fireStoreSub.unsubscribe();
        }
        this._user = null;
        this.store.dispatch(authActions.unsetUser());
        this.store.dispatch(ingresoEgresoActions.unsetItems());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({user}) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.fireStore.doc(`${user.uid}/usuario`).set({...newUser});
      });
  }

  loginUsuario(email:string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logOut() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map(user => user != null));
  }

}
