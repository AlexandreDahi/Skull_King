import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8080/rooms';

  // BehaviorSubject garde le dernier état des rooms
  private rooms = new BehaviorSubject<any[]>([]);
  rooms$ = this.rooms.asObservable();
  
  constructor(private http: HttpClient) {}

  // Création d'une room avec roomName + hostName
  createRoom(roomName: string, hostName: string): Observable<any> {
    return this.http.post(this.apiUrl, { roomName, hostName });
  }

  // Récupération de la liste des rooms
  getRooms(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.rooms.next(data));
  }
  
  // Rejoindre une room avec roomId + playerName
  joinRoom(roomId: string, playerName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${roomId}/join`, { playerName });
  }

  // Récupération des joueurs d'une room
  getPlayers(roomUuid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${roomUuid}/players`);
  }
}
