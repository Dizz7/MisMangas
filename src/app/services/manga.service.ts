import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MangaService {

  private API_URL = 'https://api.jikan.moe/v4/manga';

  constructor(private http: HttpClient) { }
  
  // Método GET para obtener mangas del primer semestre de 2025
    getMangasPrimerSemestre() {
      return this.http.get<any>(this.API_URL);
    }

}
