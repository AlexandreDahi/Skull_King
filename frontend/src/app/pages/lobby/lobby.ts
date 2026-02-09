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
    isAdmin?: boolean ;
    roomName: string = '';
    roomUuid: string = '';
    playerUuid: string = '';
    private lobbySubscription?: Subscription;
    private isDestroyed = false;

    constructor(
        private wsService: WebSocketService,
        private roomService: RoomService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.wsService.reconnectIfPossible();

        this.roomUuid = this.route.snapshot.paramMap.get('id') || '';
        this.roomService.getRoomName(this.roomUuid).subscribe(res => {
            this.roomName = res.room_name;
        });

        // ✅ ATTENDRE que les infos du joueur arrivent AVANT de continuer
        this.wsService.playerInfoReady$.subscribe(() => {
            this.playerUuid = this.wsService.getPlayerUuid();
            this.isAdmin = this.wsService.isAdmin();
            
            console.log('=== LOBBY INIT ===');
            console.log('Room UUID:', this.roomUuid);
            console.log('Room Name:', this.roomName);
            console.log('Player UUID:', this.playerUuid);
            console.log('Is Admin:', this.isAdmin);
            
            // ✅ Chargement initial UNE SEULE FOIS
            this.loadPlayers();
        });
        
        // ✅ S'abonner au WebSocket pour les mises à jour en temps réel
        this.lobbySubscription = this.wsService.getLobbyChannel().subscribe({
            next: (message) => {
                if (this.isDestroyed) return;
                console.log('📨 Message recue dans le lobby :', message);
                this.handleLobbyMessage(message);
            },
            error: (err) => console.error('❌ Erreur lobby channel:', err)
        });
    }

    private loadPlayers() {
        if (this.isDestroyed) return;
        
        console.log('🔄 Chargement initial des joueurs...');
        
        this.roomService.getPlayers(this.roomUuid).subscribe({
            next: (response: any) => {
                if (this.isDestroyed) return;
                // const players = response.players || [];
                console.log('✅ Joueurs récupérés:', response);

                this.players = response.map((p: any) => ({
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
        
        console.log("Données reçues dans la fonction handleLobbyMessage: ", data)
        console.log('📥 Type de message WebSocket:', data.type);
        
        switch(data.type) {
            case 'LOBBY_UPDATE':
                // ✅ Un nouveau joueur a rejoint - l'ajouter à la liste
                console.log('👤 Nouveau joueur:', data.player_name);
                
                // Vérifier que le joueur n'existe pas déjà
                const playerExists = this.players.some(p => p.uuid === data.player_uuid);
                if (!playerExists) {
                    this.players.push({
                        uuid: data.player_uuid,
                        name: data.player_name,
                        isAdmin: data.isPlayerAdmin || false
                    });
                    console.log('✅ Joueur ajouté. Total:', this.players.length);
                }
                
                this.cdr.detectChanges();
                break;
                
            case 'GAME_START_EVENT':
                console.log('🎮 PARTIE LANCÉE ! Redirection vers /game/' + this.roomUuid);
                this.router.navigate(['/game', this.roomUuid]);
                break;
                
            default:
                console.log('⚠️ Type de message non géré:', data.type);
        }
    }

    ngOnDestroy() {
        console.log('🧹 Nettoyage du lobby');
        this.isDestroyed = true;
        
        // ❌ Plus besoin de clearInterval
        
        if (this.lobbySubscription) {
            this.lobbySubscription.unsubscribe();
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
        
        /*this.wsService.sendLobbyMessage({
            type: 'START_GAME'
        });*/

        this.wsService.sendStartGameSignal()
        
        console.log('⏳ En attente de la confirmation du serveur...');
    }

    leaveLobby() {
        console.log('👋 Départ du lobby');
        // ✅ Appel HTTP pour quitter (nécessaire pour côté serveur)
        this.roomService.leaveRoom(this.roomUuid, this.playerUuid).subscribe({
            next: () => {
                console.log('✅ Déconnexion réussie');
                // Le WebSocket notifiera automatiquement les autres joueurs
            },
            error: (err) => {
                console.error('❌ Erreur déconnexion:', err);
            }
        });
        
        this.router.navigate(['/']);
    }
}