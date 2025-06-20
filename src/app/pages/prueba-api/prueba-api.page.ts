import { Component, OnInit } from '@angular/core';
import { ApiExternaService } from 'src/app/services/api-externa.service';


@Component({
  selector: 'app-prueba-api',
  templateUrl: './prueba-api.page.html',
  styleUrls: ['./prueba-api.page.scss'],
  standalone: false,
})
export class PruebaApiPage implements OnInit {

  users: any[] = [];
  nuevoUsuario: any = { name: '', email: '' }; // Objeto para el nuevo usuario
  editando: boolean = false;
  usuarioEditandoId: number | null = null;
  mangas: any[] = [];

  constructor(
    private apiExternaService: ApiExternaService,
  ) { }

  

  ngOnInit() {

    // Llamar al método GET de la API al iniciar el componente
    this.apiExternaService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );

  }


  // Agregar o actualizar un usuario
  agregarUsuario() {
    if (this.editando) {
      this.actualizarUsuario();
    } else {
      this.apiExternaService.createUser(this.nuevoUsuario).subscribe (
        (response) => {
          console.log('Usuario creado:', response);
          this.users.push(response); // Agregar el nuevo usuario a la lista
          this.nuevoUsuario = {name: '', email: ''}; // Limpiar el formulario
        },
        (error) => {
        console.error('Error al crear el usuario:', error);
        }
      );
    }
  }

  editarUsuario(user: any) {
    this.nuevoUsuario = { name: user.name, email: user.email };
    this.editando = true;
    this.usuarioEditandoId = user.id;
  }

  actualizarUsuario() {
    if (this.usuarioEditandoId !== null) {
      this.apiExternaService.updateUser(this.usuarioEditandoId, this.nuevoUsuario).subscribe(
        (response) => {
          const index = this.users.findIndex(u => u.id === this.usuarioEditandoId);
          if (index !== -1) this.users[index] = response;
          this.nuevoUsuario = { name: '', email: '' };
          this.editando = false;
          this.usuarioEditandoId = null;
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }

  eliminarUsuario(id: number) {
    this.apiExternaService.deleteUser(id).subscribe(
      () => {
        this.users = this.users.filter(user => user.id !== id);
      },
      (error) => {
        console.error('Error al eliminar el usuario:', error);
      }
    );
  }

}
