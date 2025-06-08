import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-leyendo',
  templateUrl: './leyendo.page.html',
  styleUrls: ['./leyendo.page.scss'],
  standalone: false
})
export class LeyendoPage implements OnInit {
  estados: string[] = ['Leyendo', 'Leído', 'Por Leer', 'Abandonado'];
  mangas: any[] = [];

  constructor(private menuCtrl: MenuController,
              private alertController: AlertController
  ) {}

  ngOnInit() {
    this.menuCtrl.close("main-menu");

    // Solo se ejecuta la primera vez (cuando no hay nada guardado)
    const guardados = localStorage.getItem('mangas');
    if (!guardados) {
      this.mangas = [
        { nombre: 'Jujutsu Kaisen', volumen: '2', imagen: '/assets/mangas/JJ2.png', estadoSeleccionado: 'Leyendo' },
        { nombre: 'Jujutsu Kaisen', volumen: '1', imagen: '/assets/mangas/JJ1.png', estadoSeleccionado: 'Leído' },
        { nombre: 'Jujutsu Kaisen', volumen: '3', imagen: '/assets/mangas/JJ3.png', estadoSeleccionado: 'Por Leer' },
        { nombre: 'Boys Abyss', volumen: '15', imagen: '/assets/mangas/BA15.jpg', estadoSeleccionado: 'Leyendo' },
        { nombre: 'Boys Abyss', volumen: '14', imagen: '/assets/mangas/BA14.jpg', estadoSeleccionado: 'Leído' },
        { nombre: 'Boys Abyss', volumen: '16', imagen: '/assets/mangas/BA16.jpg', estadoSeleccionado: 'Por Leer' },
        { nombre: 'Happiness', volumen: '2', imagen: '/assets/mangas/Happiness2.jpg', estadoSeleccionado: 'Leyendo' },
        { nombre: 'Happiness', volumen: '1', imagen: '/assets/mangas/Happiness1.jpg', estadoSeleccionado: 'Leído' },
        { nombre: 'Happiness', volumen: '3', imagen: '/assets/mangas/Happiness3.jpg', estadoSeleccionado: 'Por Leer' }
      ];
      localStorage.setItem('mangas', JSON.stringify(this.mangas));
    }
  }

  // Este se ejecuta siempre que entra a la tab
  ionViewWillEnter() {
    this.menuCtrl.close("main-menu");

    const guardados = localStorage.getItem('mangas');
    if (guardados) {
      this.mangas = JSON.parse(guardados);
    }
  }

  get mangasFiltrados() {
    return this.mangas.filter(m => m.estadoSeleccionado === 'Leyendo');
  }

  cambiarEstado(manga: any, nuevoEstado: string) {
    manga.estadoSeleccionado = nuevoEstado;
    localStorage.setItem('mangas', JSON.stringify(this.mangas));
  }

  async agregarManga() {
    const alert = await this.alertController.create({
      cssClass: 'alert-custom',
      header: 'Agregar Manga',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del manga'
        },
        {
          name: 'volumen',
          type: 'number',
          placeholder: 'Volumen'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            const nuevoManga = {
              nombre: data.nombre,
              volumen: data.volumen,
              imagen: '/assets/mangas/default.jpg', // Imagen por defecto al agregar
              estadoSeleccionado: 'Leyendo' // Por defecto al agregar
            };
  
            this.mangas.push(nuevoManga);
            localStorage.setItem('mangas', JSON.stringify(this.mangas));
          }
        }
      ]
    });
  
    await alert.present();
  }
  
}