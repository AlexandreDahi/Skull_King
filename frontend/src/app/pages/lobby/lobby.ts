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
export class Lobby implements OnInit, OnDestroy {

    appState = model.required<string>()

    players = signal<Player[]>([])
    isAdmin = signal(false)

    roomUuid: string = '';
    playerUuid: string = '';

    wsService = inject(webSocketService)

    constructor() {
        this.wsService.roomPlayers
            .pipe(takeUntilDestroyed())
            .subscribe((players) => {
                this.players.set(players)
            })
    }

    ngOnInit() {

        this.isAdmin.set(this.wsService.isHost())

    }

    private handleLobbyMessage(data: any) {
        
    }

    ngOnDestroy() {
        

    }

    startGame() {
        if (!this.isAdmin) {
            console.warn('⚠️ Vous n\'êtes pas admin');
            return;
        }
        
        if (this.players.length < 2) {
            console.warn('⚠️ Pas assez de joueurs (min: 2, actuel: ' + this.players.length + ')');
            alert('Il faut au moins 2 joueurs pour lancer la partie !');
            return;
        }
        
        console.log('🚀 Envoi du signal START_GAME au serveur...');
        
        /*this.wsService.sendLobbyMessage({
            type: 'START_GAME'
        });*/

        //this.wsService.sendStartGameSignal()
        
        console.log('⏳ En attente de la confirmation du serveur...');
    }

    leaveLobby() {
        
        this.wsService.leaveRoom()
        
        this.appState.set("inRoomsList")

    }
}