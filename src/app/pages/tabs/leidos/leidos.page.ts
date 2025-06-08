import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-leidos',
  templateUrl: './leidos.page.html',
  styleUrls: ['./leidos.page.scss'],
  standalone: false
})
export class LeidosPage implements OnInit {
  estados: string[] = ['Leyendo', 'Leído', 'Por Leer', 'Abandonado'];
  mangas: any[] = [];

  constructor(private menuCtrl: MenuController) {}

  ngOnInit() {
    this.menuCtrl.close("main-menu");
  }

  ionViewWillEnter() {
    this.menuCtrl.close("main-menu");

    const guardados = localStorage.getItem('mangas');
    if (guardados) {
      this.mangas = JSON.parse(guardados);
    }
  }

  get mangasFiltrados() {
    return this.mangas.filter(m => m.estadoSeleccionado === 'Leído');
  }

  cambiarEstado(manga: any, nuevoEstado: string) {
    manga.estadoSeleccionado = nuevoEstado;
    localStorage.setItem('mangas', JSON.stringify(this.mangas));
  }
}