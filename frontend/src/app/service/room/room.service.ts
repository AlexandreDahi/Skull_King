import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8080/rooms';

  // BehaviorSubject garde le dernier événement pour les nouveaux abonnés
  private rooms = new BehaviorSubject<any[]>([]);
  rooms$ = this.rooms.asObservable();
  
  constructor(private http: HttpClient) {}

  // Création d'une room
  createRoom(name: string) {
    return this.http.post(this.apiUrl, { name }).pipe(
      tap(() => this.getRooms()) // recharge directement après création
    );
  }

  // Récupération de la liste des rooms
  getRooms() {
  this.http.get<any[]>(this.apiUrl).subscribe(data => this.rooms.next(data));
  }
}
