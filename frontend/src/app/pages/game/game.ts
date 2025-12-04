import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { PlaceBet } from '../../components/place-bet/place-bet';
import { ExpandablePlaceBet } from '../../components/expandable-place-bet/expandable-place-bet';
import { Hand } from '../../components/hand/hand';
import { DropZone } from '../../components/drop-zone/drop-zone';
import { OtherPlayers } from '../../components/other-players/other-players';
import { Navbar } from '../../components/navbar/navbar';

import { WebSocketService } from '../../service/websocket/websocket.service';
import { RoomService } from '../../service/room/room.service';

interface Player {
  uuid: string;
  name: string;
  isAdmin?: boolean;
  score?: number;
  bet?: number;
}

interface GameState {
  currentRound: number;
  currentTurn: string; // UUID du joueur dont c'est le tour
  phase: 'BETTING' | 'PLAYING' | 'ROUND_END' | 'GAME_END';
}

@Component({
  selector: 'app-game',
  imports: [Hand, CommonModule, PlaceBet, ExpandablePlaceBet, OtherPlayers, DropZone, Navbar],
  templateUrl: './game.html',
  styleUrl: './game.css',
  standalone: true
})
export class Game implements OnInit, OnDestroy {
  // Référence à la main du joueur
  @ViewChild(Hand) hand!: Hand;

  // Données de la partie
  roomUuid: string = '';
  playerUuid: string = '';
  isAdmin: boolean = false;
  
  // État du jeu
  players: Player[] = [];
  gameState: GameState = {
    currentRound: 1,
    currentTurn: '',
    phase: 'BETTING'
  };
  
  // Abonnements WebSocket
  private gameSubscription?: Subscription;
  private publicSubscription?: Subscription;
  private isDestroyed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wsService: WebSocketService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    // 1. Récupérer les informations de la route
    this.roomUuid = this.route.snapshot.paramMap.get('id') || '';
    this.isAdmin = this.wsService.isAdmin();
    
    console.log('🎮 === GAME INIT ===');
    console.log('Room UUID:', this.roomUuid);
    console.log('Is Admin:', this.isAdmin);
    
    if (!this.roomUuid) {
      console.error('❌ Pas de room UUID, retour à l\'accueil');
      this.router.navigate(['/']);
      return;
    }

    // 2. Charger l'état initial de la partie
    this.loadGameState();

    // 3. S'abonner aux événements de jeu via WebSocket
    this.subscribeToGameEvents();
  }

  /**
   * Charger l'état initial de la partie via l'API
   */
  private loadGameState() {
    console.log('📡 Chargement de l\'état de la partie...');
    
    // Charger la liste des joueurs
    this.roomService.getPlayers(this.roomUuid).subscribe({
      next: (players: any[]) => {
        console.log('✅ Joueurs chargés:', players);
        this.players = players.map(p => ({
          uuid: p.uuid,
          name: p.name,
          isAdmin: p.isAdmin || false,
          score: 0,
          bet: undefined
        }));
      },
      error: (err) => {
        console.error('❌ Erreur chargement joueurs:', err);
      }
    });

    // TODO: Charger l'état du jeu (manche actuelle, cartes, etc.)
  }

  /**
   * S'abonner aux événements de jeu via WebSocket
   */
  private subscribeToGameEvents() {
    console.log('🔌 Abonnement aux événements de jeu...');

    // Canal public de la room (événements broadcast à tous)
    this.publicSubscription = this.wsService.getPublicChannel().subscribe({
      next: (message) => {
        if (this.isDestroyed) return;
        
        console.log('📢 Message public reçu:', message.body);
        try {
          const data = JSON.parse(message.body);
          this.handleGameMessage(data);
        } catch (e) {
          console.error('Erreur parsing message:', e);
        }
      },
      error: (err) => console.error('❌ Erreur canal public:', err)
    });

    // TODO: S'abonner au canal privé pour les événements personnels
    // (distribution des cartes, etc.)
  }

  /**
   * Gérer les messages WebSocket du jeu
   */
  private handleGameMessage(data: any) {
    if (this.isDestroyed) return;

    console.log('📥 Type de message:', data.type);

    switch(data.type) {
      case 'GAME_STATE_UPDATE':
        // Mise à jour de l'état général du jeu
        console.log('🔄 Mise à jour de l\'état du jeu');
        if (data.gameState) {
          this.gameState = data.gameState;
        }
        break;

      case 'PLAYER_BET':
        // Un joueur a placé son pari
        console.log('💰 Pari reçu:', data.playerUuid, data.bet);
        const player = this.players.find(p => p.uuid === data.playerUuid);
        if (player) {
          player.bet = data.bet;
        }
        break;

      case 'CARD_PLAYED':
        // Un joueur a joué une carte
        console.log('🃏 Carte jouée par:', data.playerUuid);
        // TODO: Afficher la carte dans la drop zone
        break;

      case 'ROUND_START':
        // Début d'une nouvelle manche
        console.log('🎯 Nouvelle manche:', data.round);
        this.gameState.currentRound = data.round;
        this.gameState.phase = 'BETTING';
        // TODO: Distribuer les cartes
        break;

      case 'TURN_CHANGED':
        // Le tour passe à un autre joueur
        console.log('🔄 Tour du joueur:', data.playerUuid);
        this.gameState.currentTurn = data.playerUuid;
        break;

      case 'ROUND_END':
        // Fin de manche
        console.log('🏁 Fin de manche');
        this.gameState.phase = 'ROUND_END';
        // TODO: Afficher les scores
        break;

      case 'GAME_END':
        // Fin de partie
        console.log('🎊 Fin de partie !');
        this.gameState.phase = 'GAME_END';
        // TODO: Afficher le classement final
        break;

      default:
        console.log('⚠️ Message non géré:', data.type);
    }
  }

  /**
   * Quand une carte est déposée dans la zone de jeu
   */
  onCardDropped(cardId: number) {
    console.log("🃏 Carte déposée :", cardId);
    
    // Vérifier que c'est bien le tour du joueur
    if (this.gameState.currentTurn !== this.playerUuid) {
      console.warn('⚠️ Ce n\'est pas votre tour !');
      // TODO: Afficher un message d'erreur
      return;
    }

    // Envoyer la carte jouée au serveur via WebSocket
    this.wsService.sendLobbyMessage({
      type: 'PLAY_CARD',
      cardId: cardId,
      roomUuid: this.roomUuid
    });

    // Retirer la carte de la main
    this.hand.removeCard(cardId);
  }

  /**
   * Quand le joueur place son pari
   */
  onBetPlaced(betAmount: number) {
    console.log('💰 Pari placé:', betAmount);

    // Envoyer le pari au serveur
    this.wsService.sendLobbyMessage({
      type: 'PLACE_BET',
      bet: betAmount,
      roomUuid: this.roomUuid
    });

    // Mettre à jour localement
    const currentPlayer = this.players.find(p => p.uuid === this.playerUuid);
    if (currentPlayer) {
      currentPlayer.bet = betAmount;
    }

    // Passer à la phase de jeu
    this.gameState.phase = 'PLAYING';
  }

  /**
   * Quitter la partie
   */
  leaveGame() {
    console.log('👋 Quitter la partie');
    
    // Envoyer un message de départ
    this.wsService.sendLobbyMessage({
      type: 'LEAVE_GAME',
      roomUuid: this.roomUuid
    });

    // Retourner à l'accueil
    this.router.navigate(['/']);
  }

  /**
   * Vérifier si c'est le tour du joueur actuel
   */
  isMyTurn(): boolean {
    return this.gameState.currentTurn === this.playerUuid;
  }

  /**
   * Obtenir le nom du joueur dont c'est le tour
   */
  getCurrentPlayerName(): string {
    const player = this.players.find(p => p.uuid === this.gameState.currentTurn);
    return player ? player.name : 'Inconnu';
  }

  /**
   * Nettoyage à la destruction du composant
   */
  ngOnDestroy() {
    console.log('🧹 Nettoyage du composant Game');
    this.isDestroyed = true;

    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    if (this.publicSubscription) {
      this.publicSubscription.unsubscribe();
    }
  }
}