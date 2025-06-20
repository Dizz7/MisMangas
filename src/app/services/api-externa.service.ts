import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiExternaService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/users'; // URL de ejemplo

  constructor(
      private http: HttpClient,
  )
   { }

// Método GET de api usuarios
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

// Método POST de api usuarios
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

// Método PUT de api usuarios
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

// Método DELETE de api usuarios
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
}
