import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Helicoptero } from '../models/helicopteros/Helicoptero';
import { StorageService } from './storage.service';
import { HelicopteroReaction } from '../models/helicopteros/HelicopteroReaction';

@Injectable({
  providedIn: 'root'
})
export class HelicopteroService {

 apiURL = 'https://helicopteroapi-spring.onrender.com/'; // cambia a tu endpoint real si es remoto
  token = '';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.token = this.storageService.getSession('token');
    console.log(this.token);
  }
/*
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.token,
    }),
  };*/

  errorMessage = '';
  getHttpOptions() {
    const token = this.storageService.getSession('token'); // lee porque si no se me traba por alguna razon
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
  }


 postHelicoptero(myHelicoptero: Helicoptero): Observable<any> {
    return this.http
      .post(this.apiURL + 'api/helicoptero/create', myHelicoptero, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }
  // 🚁 Obtener lista de helicópteros
  getHelicopteros(page: number = 0, size: number = 10): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiURL}api/helicoptero/all?page=${page}&size=${size}`,
        this.getHttpOptions()
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // ❤️ Reaccionar a un helicóptero

    postReaccion(reactionRequest: HelicopteroReaction): Observable<any> {
    return this.http.post(
      this.apiURL + 'api/reactions/create', // asegúrate de que esta ruta coincida
      reactionRequest,
      this.getHttpOptions()
    ).pipe(catchError(this.handleError));
  }

  // 💬 Comentar un helicóptero
  postComentario(comentario: { contenido: string; helicopteroId: number }): Observable<any> {
    return this.http.post(this.apiURL + 'api/comentarios/create', comentario, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }


  // 📥 Obtener comentarios de un helicóptero
  getComentariosPorHelicoptero(helicopteroId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + `api/comentarios/get/${helicopteroId}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  // 🏆 Obtener la reacción más votada
  getReaccionMasVotada(helicopteroId: number): Observable<string> {
    return this.http.get(`https://helicopteroapi-spring.onrender.com/api/reactions/most-voted/${helicopteroId}`, { //cambiar la ruta cuando subas back a reender
      responseType: 'text'
    });
  }

   buscarHelicopteros(termino: string): Observable<Helicoptero[]> {
    return this.http.get<Helicoptero[]>(`https://helicopteroapi-spring.onrender.com/api/helicoptero/buscar?termino=${termino}`); //cambiar tambien ruta
  }

  deleteHelicoptero(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiURL}api/helicoptero/delete/${id}`,
      {
        ...this.getHttpOptions(),
        responseType: 'text' as 'json'  // 👈 esto evita que Angular intente parsear JSON
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores (igual al ejemplo)
  handleError(error: any) {
    let message = '';
    if (error.error instanceof ErrorEvent) {
      message = `Error: ${error.error.message}`;
    } else {
      message = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(() => message);
  }
}
