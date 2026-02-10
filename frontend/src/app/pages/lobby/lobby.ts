import { Component, OnInit, OnDestroy, inject, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { webSocketService } from '../../service/websocket/websocket.service';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Player {
    uuid: string;
    name: string;
    isAdmin?: boolean;
}

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.html',
  styleUrls: ['./lobby.css'],
  standalone: true,
  imports: [CommonModule, Navbar]
})
export class Lobby {

    appState = model.required<string>()

    players = signal<Player[]>([])
    isAdmin = signal(false)

    roomUuid: string = '';
    playerUuid: string = '';

    wsService = inject(webSocketService)

    constructor() {
        this.wsService.roomPlayers
            .pipe(takeUntilDestroyed())
            .subscribe((room) => {
                this.players.set(room.players)
                this.isAdmin.set(room.host === this.wsService.getPlayerUuid())
            })

        this.wsService.onGameStartEvent((message: any) => {
            this.appState.set("inGame")
        })
    }


    startGame() {
        if (!this.isAdmin) {
            console.warn('⚠️ Vous n\'êtes pas admin');
            return;
        }
        
        if (this.players().length < 2) {
            console.warn('⚠️ Pas assez de joueurs (min: 2, actuel: ' + this.players.length + ')');
            alert('Il faut au moins 2 joueurs pour lancer la partie !');
            return;
        }
        
        console.log('🚀 Envoi du signal START_GAME au serveur...');

        this.wsService.startGame()
        
    }

    leaveLobby() {
        
        this.wsService.leaveRoom()
        
        this.appState.set("inRoomsList")

    }
}