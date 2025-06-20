import { Component, OnInit } from '@angular/core';
import { MangaService } from 'src/app/services/manga.service';

@Component({
  selector: 'app-mangas01-2025',
  templateUrl: './mangas01-2025.component.html',
  styleUrls: ['./mangas01-2025.component.scss'],
  standalone: false
})
export class Mangas012025Component  implements OnInit {
  
  mangas: any[] = [];

  constructor(
    private mangaService: MangaService,
  ) { }

  ngOnInit(): void {
    this.mangaService.getMangasPrimerSemestre().subscribe(response => {
      this.mangas = response.data.map((manga: any) => ({
        title: manga.title,
        authors: manga.authors.map((a: any) => a.name),
        image: manga.images?.jpg?.small_image_url || '',
        synopsis: manga.synopsis
      }));
    });


}
}

