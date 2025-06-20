import { Component, OnInit } from '@angular/core';
import { MangaService } from 'src/app/services/manga.service';

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
  ) { }

  ngOnInit() {

    this.mangaService.getMangasPrimerSemestre().subscribe(
      (response: any) => {
        this.mangas = response.data.map((manga: any) => ({
          title: manga.title,
          authors: manga.authors.map((a: any) => a.name),
          image: manga.images?.jpg?.small_image_url || '',
          synopsis: manga.synopsis || ''
        }));
      },
      (error) => {
        console.error('Error al obtener mangas:', error);
      }
    );


  }

}
