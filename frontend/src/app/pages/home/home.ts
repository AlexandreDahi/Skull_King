import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomCard } from '../../components/room-card/room-card';
import { Navbar } from '../../components/navbar/navbar';
import { MatIconModule } from '@angular/material/icon';
import { RoomService } from '../../service/room/room.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [RoomCard, MatIconModule, Navbar, CommonModule, FormsModule],
})
export class HomeComponent implements OnInit {
  rooms: any[] = [];
  loading = true;
  filteredRooms: any[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.roomService.getRooms();

    this.roomService.rooms$.subscribe(data => {
      console.log('🔄 Rooms mises à jour:', data);

      this.rooms = data;
      this.filterRooms();
      this.loading = false;
    });

    
  }

  goToRooms() {
    this.router.navigate(['/room']);
  }

  filterRooms() {
    let result = [...this.rooms];

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(room => 
        room.room_name.toLowerCase().includes(query) ||
        room.host_name.toLowerCase().includes(query)
      );
    }

    // Affiche seulement les rooms disponibles (pas pleines)
    result = result.filter(room => room.nb_players < 8);

    this.filteredRooms = result;
  }

  refreshRooms() {
  this.loading = true;
  this.roomService.getRooms();
  this.loading = false;
  }

  getEmptyMessage(): string {
    if (this.searchQuery.trim()) {
      return `Aucune partie trouvée pour "${this.searchQuery}"`;
    }
    if (this.rooms.length > 0) {
      return 'Toutes les parties sont pleines ! Crée la tienne ! 🏴‍☠️';
    }
    return 'La mer est calme… aucune partie en vue ! ⚓';
  }
}