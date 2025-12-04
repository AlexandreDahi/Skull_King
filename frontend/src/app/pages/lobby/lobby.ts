import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../service/websocket/websocket.service';
import { RoomService } from '../../service/room/room.service';
import { Navbar } from '../../components/navbar/navbar';
import { Subscription } from 'rxjs';

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
    players: Player[] = [];
    isAdmin: boolean = false;
    roomName: string = '';
    roomUuid: string = '';
    private lobbySubscription?: Subscription;
    private publicSubscription?: Subscription;
    private intervalId?: any;
    private isDestroyed = false;

    constructor(
        private wsService: WebSocketService,
        private roomService: RoomService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.roomUuid = this.route.snapshot.paramMap.get('id') || '';
        this.isAdmin = this.wsService.isAdmin();
        
        console.log('=== LOBBY INIT ===');
        console.log('Room UUID:', this.roomUuid);
        console.log('Is Admin:', this.isAdmin);
        
        // Chargement initial
        this.loadPlayers();
        
        // S'abonner au canal du lobby pour les événements
        this.lobbySubscription = this.wsService.getLobbyChannel().subscribe({
            next: (message) => {
                if (this.isDestroyed) return;
                console.log('📨 Message lobby reçu:', message.body);
                try {
                    const data = JSON.parse(message.body);
                    this.handleLobbyMessage(data);
                } catch (e) {
                    console.error('Erreur parsing message:', e);
                }
            },
            error: (err) => console.error('❌ Erreur lobby channel:', err)
        });

        // Polling toutes les 5 secondes
        this.intervalId = setInterval(() => {
            if (!this.isDestroyed) {
                this.loadPlayers();
            }
        }, 5000);
    }

    private loadPlayers() {
        if (this.isDestroyed) return;
        
        this.roomService.getPlayers(this.roomUuid).subscribe({
            next: (players: any[]) => {
                if (this.isDestroyed) return;
                
                console.log('✅ Joueurs récupérés:', players.length);
                
                this.players = players.map(p => ({
                    uuid: p.uuid,
                    name: p.name,
                    isAdmin: p.isAdmin || false
                }));
                
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (!this.isDestroyed) {
                    console.error('❌ ERREUR API:', err);
                }
            }
        });
    }

    private handleLobbyMessage(data: any) {
        if (this.isDestroyed) return;
        
        console.log('📥 Type de message WebSocket:', data.type);
        
        switch(data.type) {
            case 'NEW_PLAYER_EVENT':
                console.log('➕ Nouveau joueur via WebSocket');
                this.loadPlayers();
                break;
                
            case 'PLAYER_JOINED':
                console.log('➕ Joueur ajouté');
                if (data.data && !this.players.find(p => p.uuid === data.data.uuid)) {
                    this.players.push({
                        uuid: data.data.uuid,
                        name: data.data.name,
                        isAdmin: data.data.isAdmin || false
                    });
                    this.cdr.detectChanges();
                }
                break;
                
            case 'PLAYER_LEFT':
                console.log('➖ Joueur parti');
                if (data.playerUuid) {
                    this.players = this.players.filter(p => p.uuid !== data.playerUuid);
                    this.cdr.detectChanges();
                }
                break;
                
            case 'GAME_STARTED':
                console.log('🎮 PARTIE LANCÉE ! Redirection vers /game/' + this.roomUuid);
                // ✅ TOUS les joueurs (admin et invités) sont redirigés automatiquement
                this.router.navigate(['/game', this.roomUuid]);
                break;
                
            default:
                console.log('⚠️ Type de message non géré:', data.type);
        }
    }

    ngOnDestroy() {
        console.log('🧹 Nettoyage du lobby');
        this.isDestroyed = true;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        if (this.lobbySubscription) {
            this.lobbySubscription.unsubscribe();
        }
        if (this.publicSubscription) {
            this.publicSubscription.unsubscribe();
        }
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
        
        // Envoyer le message via WebSocket
        this.wsService.sendLobbyMessage({
            type: 'START_GAME'
        });
        
        console.log('⏳ En attente de la confirmation du serveur...');
    }

    leaveLobby() {
        console.log('👋 Départ du lobby');
        
        // Optionnel : envoyer un message de départ
        this.wsService.sendLobbyMessage({
            type: 'LEAVE_LOBBY'
        });
        
        this.router.navigate(['/']);
    }
}