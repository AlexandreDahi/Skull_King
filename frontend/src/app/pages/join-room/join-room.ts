import { Component , Input, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Navbar } from '../../components/navbar/navbar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../service/room/room.service';
import { FormsModule } from '@angular/forms';  
@Component({
  selector: 'app-join-room',
  imports: [MatIconModule , Navbar,FormsModule],
  templateUrl: './join-room.html',
  styleUrl: './join-room.css',
})

export class JoinRoom implements OnInit {

  roomId!: string;
  title!: string;
  hostName!: string;
  players!: number;
  maxPlayers!: number;

  playerName = '';

  constructor(private route: ActivatedRoute, private router: Router, private roomService: RoomService) {}

  ngOnInit(): void {
    // Récupération de l’UUID dans l’URL
    this.roomId = this.route.snapshot.paramMap.get('id')!;

    // Récupération des query params envoyés depuis RoomCard
    this.route.queryParams.subscribe(params => {
      this.title = params['title'];
      this.hostName = params['host'];
      this.players = params['players'];
      this.maxPlayers = params['maxPlayers'];
    });
  }

  joinGame() {
    if (!this.playerName || this.playerName.trim() === "") {
      alert("Tu dois entrer un nom de pirate !");
      return;
    }

    this.roomService.joinRoom(this.roomId, this.playerName).subscribe({
      next: () => {
        // Redirection vers la partie après l'ajout du joueur
        this.router.navigate(['/game', this.roomId]);
      },
      error: (err) => {
        console.error(err);
        alert("Impossible de rejoindre la room...");
      }
    });
  }

  cancel() {
    window.history.back();
  }
}
