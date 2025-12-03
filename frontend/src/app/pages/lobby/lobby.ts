import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
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
        private cdr: ChangeDetectorRef  // Ajout pour forcer la détection de changement
    ) {}

    ngOnInit() {
        this.roomUuid = this.route.snapshot.paramMap.get('id') || '';
        this.isAdmin = this.wsService.isAdmin();
        
        console.log('=== LOBBY INIT ===');
        console.log('Room UUID:', this.roomUuid);
        console.log('Is Admin:', this.isAdmin);
        
        // 1. CHARGEMENT IMMÉDIAT
        console.log('🔵 Chargement #1 - Immédiat');
        this.loadPlayers();
        
        
        // S'abonner au canal du lobby
        console.log('📡 Abonnement au WebSocket...');
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
            error: (err) => console.error('❌ Erreur lobby channel:', err),
            complete: () => console.log('✅ Lobby channel complété')
        });

        // S'abonner au canal public
        this.publicSubscription = this.wsService.getPublicChannel().subscribe({
            next: (message) => {
                if (this.isDestroyed) return;
                console.log('📢 Message public reçu:', message.body);
                try {
                    const data = JSON.parse(message.body);
                    if (data.type === 'NEW_PLAYER_EVENT') {
                        console.log('🔔 Nouveau joueur détecté');
                        this.loadPlayers();
                    }
                } catch (e) {
                    // Ignore les messages non-JSON
                }
            },
            error: (err) => console.error('❌ Erreur public channel:', err)
        });

        // Polling toutes les 3 secondes
        this.intervalId = setInterval(() => {
            if (!this.isDestroyed) {
                console.log('🔄 Polling périodique');
                this.loadPlayers();
            }
        }, 3000);
    }

    private loadPlayers() {
        if (this.isDestroyed) {
            console.log('⚠️ Composant détruit');
            return;
        }
        
        console.log('📡 API Call: GET /rooms/' + this.roomUuid + '/players');
        
        this.roomService.getPlayers(this.roomUuid).subscribe({
            next: (players: any[]) => {
                if (this.isDestroyed) return;
                
                console.log('✅ RÉPONSE API:', players);
                console.log('Nombre de joueurs reçus:', players.length);
                
                this.players = players.map(p => ({
                    uuid: p.uuid,
                    name: p.name,
                    isAdmin: p.isAdmin || false
                }));
                
                console.log('🎮 players[] mis à jour:', this.players);
                
                // FORCER la détection de changement Angular
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
                console.log('➕ Nouveau joueur via WebSocket:', data.data);
                this.loadPlayers();
                break;
                
            case 'PLAYER_JOINED':
                console.log('➕ Joueur ajouté:', data.player);
                if (!this.players.find(p => p.uuid === data.player.uuid)) {
                    this.players.push({
                        uuid: data.player.uuid,
                        name: data.player.name,
                        isAdmin: data.player.isAdmin || false
                    });
                    this.cdr.detectChanges();
                }
                break;
                
            case 'PLAYER_LEFT':
                console.log('➖ Joueur parti:', data.playerUuid);
                this.players = this.players.filter(p => p.uuid !== data.playerUuid);
                this.cdr.detectChanges();
                break;
                
            case 'GAME_STARTED':
                console.log('🎮 Partie lancée');
                this.router.navigate(['/game', this.roomUuid]);
                break;
                
            default:
                console.log('⚠️ Type de message non géré:', data.type);
        }
    }

    ngOnDestroy() {
        console.log('🧹 DESTRUCTION DU COMPOSANT');
        this.isDestroyed = true;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log('✅ Intervalle arrêté');
        }
        
        if (this.lobbySubscription) {
            this.lobbySubscription.unsubscribe();
        }
        if (this.publicSubscription) {
            this.publicSubscription.unsubscribe();
        }
    }

    startGame() {
        if (this.isAdmin && this.players.length >= 2) {
            console.log('🚀 START GAME');
            this.wsService.sendLobbyMessage({ type: 'START_GAME' });
        } else {
            console.warn('⚠️ Pas assez de joueurs ou pas admin');
        }
    }

    leaveLobby() {
        console.log('👋 LEAVE');
        this.router.navigate(['/']);
    }
}