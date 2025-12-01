import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomCard } from '../../components/room-card/room-card';
import { Navbar } from '../../components/navbar/navbar';
import {MatIconModule} from '@angular/material/icon';
import { RoomService } from '../../service/room/room.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [RoomCard , MatIconModule , Navbar , CommonModule],
})


export class HomeComponent implements OnInit {

  rooms: any[] = [];  // <-- liste des rooms
  loading = true;
  filteredRooms: any[] = []; // <-- liste des rooms filtrées

  constructor(
    private router: Router,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.roomService.rooms$.subscribe(data => {
      this.rooms = data;

      this.filteredRooms = data.filter(room => room.nbPlayers < 8);

      this.loading = false;
    });

    this.roomService.getRooms();
  }

  goToRooms() {
    this.router.navigate(['/room']);
  }
}