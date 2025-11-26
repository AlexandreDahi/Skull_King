import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoomCard } from '../../components/room-card/room-card';
import { Navbar } from '../../components/navbar/navbar';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [RoomCard , MatIconModule , Navbar],
})

export class HomeComponent {

  constructor(private router: Router) {}

  goToRooms() {
    this.router.navigate(['/room']);
  }
}