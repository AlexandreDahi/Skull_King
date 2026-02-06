import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomCard } from '../../components/room-card/room-card';
import { Navbar } from '../../components/navbar/navbar';
import { MatIconModule } from '@angular/material/icon';
import { RoomService } from '../../service/room/room.service';
import { CommonModule } from '@angular/common';
import { webSocketService } from '../../service/websocket/websocket.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  templateUrl: './room-list.html',
  styleUrls: ['./room-list.css'],
  imports: [RoomCard, MatIconModule, Navbar, CommonModule, FormsModule],
})
export class RoomListComponent implements OnInit {

  appState = model.required<string>()

  rooms = signal<{room_uuid: string, host_name: string, nb_players: number}[]>([])
  searchQuery = signal("")
  filteredRooms = computed(() => this.filterRooms(this.rooms(), this.searchQuery()))


  wsService = inject(webSocketService)

  loading = true;
  
  

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    this.loading = false;

    this.wsService.onGetRoomsAnswer((message: any) => {
      this.rooms.set(message.rooms)
    })

    setTimeout(() => this.wsService.getRooms(), 500) // bad

    this.wsService.onJoinRoomAnswer((message: any) => {
      
      if (message.status === "ok") {
        this.appState.set("inLobby")
      } else {
        console.log("erreur join room : ", message.reason)
      }
    })
    
    this.wsService.onCreateRoomAnswer((message: any) => {
      if (message.status === "ok") {
        this.appState.set("inLobby")
      } else {
        console.log("erreur join room : ", message.reason)
      }
      
    })


  }

  joinRoom(room_uuid: string) {

    this.wsService.joinRoom(room_uuid)
    
  }

  createRoom() {
    this.wsService.createRoom()
  }

  filterRooms(rooms: any[], searchQuery: string) {

    console.log("filtered room is updated !")
    let result = [...rooms];

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(room => 
        //room.name.toLowerCase().includes(query) ||
        room.host_name.toLowerCase().includes(query)
      );
    }

    // Affiche seulement les rooms disponibles (pas pleines)
    result = result.filter(room => room.nb_players < 8);

    return result;
  }

  refreshRooms() {
    this.loading = true;
    this.wsService.getRooms()
    this.loading = false;
  }

  getEmptyMessage(): string {
    if (this.searchQuery().trim()) {
      return `Aucune partie trouvée pour "${this.searchQuery}"`;
    }
    if (this.rooms().length > 0) {
      return 'Toutes les parties sont pleines ! Crée la tienne ! 🏴‍☠️';
    }
    return 'La mer est calme… aucune partie en vue ! ⚓';
  }
}