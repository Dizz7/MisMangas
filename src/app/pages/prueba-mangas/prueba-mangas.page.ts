import { Component, OnInit } from '@angular/core';
import { MangaService } from 'src/app/services/manga.service';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';


@Component({
  selector: 'app-prueba-mangas',
  templateUrl: './prueba-mangas.page.html',
  styleUrls: ['./prueba-mangas.page.scss'],
  standalone: false,

})
export class PruebaMangasPage implements OnInit {

  mangas: any[] = [];

  constructor(
    private mangaService: MangaService,
    private router: Router, 
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user: string };
   }

  ngOnInit() {

    // Cerrar Menú al navegar
    this.menuCtrl.close("main-menu");

    this.mangaService.getMangasPrimerSemestre().subscribe(
      (response: any) => {
        this.mangas = response.data.map((manga: any) => ({
          title: manga.title,
          authors: manga.authors.map((a: any) => a.name),
          image: manga.images?.jpg?.large_image_url || '',
          synopsis: manga.synopsis || ''
        }));
      },
      (error) => {
        console.error('Error al obtener mangas:', error);
      }
    );


  }

  // Método para ver las imágenes grandes
  async abrirImagen(imagenUrl: string) {
    const modal = await this.modalCtrl.create({
      component: ImageModalComponent,
      componentProps: {
        imagen: imagenUrl
      },
      cssClass: 'fullscreen-modal'
    });
  
    await modal.present();
  }

}
