import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  crearUsuario() {
    if (this.registroForm.valid) {
      this.loading(true);
      const {nombre, correo, password} = this.registroForm.value;
      this.authService.crearUsuario(nombre, correo, password)
        .then(credenciales => {
          console.log('credenciales', credenciales)
          this.router.navigate(['/']);
          this.loading(false);
        })
        .catch(err => {
          this.loading(false);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          })
        });;
    }
  }

  loading(start: boolean) {
    if (start) {
      Swal.fire({
        title: 'Cargando!',
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } else {
      Swal.close();
    }
  }

}
