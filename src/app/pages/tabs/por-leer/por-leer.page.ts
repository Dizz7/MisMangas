import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-por-leer',
  templateUrl: './por-leer.page.html',
  styleUrls: ['./por-leer.page.scss'],
  standalone: false
})
export class PorLeerPage implements OnInit {
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
    return this.mangas.filter(m => m.estadoSeleccionado === 'Por Leer');
  }

  cambiarEstado(manga: any, nuevoEstado: string) {
    manga.estadoSeleccionado = nuevoEstado;
    localStorage.setItem('mangas', JSON.stringify(this.mangas));
  }
}