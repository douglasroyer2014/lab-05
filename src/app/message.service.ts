import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, takeWhile, throwError } from 'rxjs';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(public http: HttpClient) {
  }

  public defaultCatch() {
    return catchError((err: any) => {
      if (err) {
        console.log(err)
      }

      return throwError(err);
    });
  }
  public listUsers() {
    return this.http.get('http://localhost:8080/tcp/usuarios').pipe(this.defaultCatch());
  }

  public getMessage() {
    return this.http.get('http://localhost:8080/tcp/mensagem').pipe(this.defaultCatch());
  }

  public sendMessage(message: any) {
    return this.http.post<any>('http://localhost:8080/udp/mensagem', message).pipe(this.defaultCatch());
  }
}
