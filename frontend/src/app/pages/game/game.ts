import { Component, ViewChild, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Subscription } from 'rxjs';

import { HeadUpDisplay } from '../../components/hud/head-up-display/head-up-display';
import { PlaceBet } from '../../components/hud/bet/place-bet/place-bet';
import { ExpandablePlaceBet } from '../../components/hud/bet/expandable-place-bet/expandable-place-bet';
import { Hand } from '../../components/hand/hand';
import { DropZone } from '../../components/drop-zone/drop-zone';
import { OtherPlayers } from '../../components/hud/players/other-players/other-players';
import { Navbar } from '../../components/navbar/navbar';
import { PlayerPanel } from '../../components/hud/player-panel/player-panel';

import { WebSocketService } from '../../service/websocket/websocket.service';
import { RoomService } from '../../service/room/room.service';
import data from '../../components/cards/index_carte.json';

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
  imports: [
    Hand, 
    CommonModule, 
    HeadUpDisplay, 
    DropZone, 
    MatIconModule, 
    PlayerPanel,
    PlaceBet, 
    ExpandablePlaceBet, 
    OtherPlayers, 
    Navbar
  ],
  templateUrl: './game.html',
  styleUrl: './game.css',
  standalone: true
})
export class Game implements OnInit, OnDestroy {
  // Référence à la main du joueur
  @ViewChild(Hand) hand!: Hand;

  /* --- WEBSOCKET DATA (de lobby) --- */
  roomUuid: string = '';
  playerUuid: string = '';
  isAdmin: boolean = false;
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

  /* --- GAME LOGIC DATA (de main) --- */
  handCards: number[] = [24, 3, 15, 65, 42, 68, 72, 4, 8, 12];
  dropZoneCards: number[] = [];

  round: number = 4;
  totalRounds: number = 10;
  phase: string = "Phase d'attente des joueurs"; // affiché en haut

  timer: number = 30;
  totalTime: number = 30;
  timerProgress: number = 100;
  intervalId: any;

  score: number = 0;
  scorePopped: boolean = false;
  tricksWon: number = 0; // nombre de plis gagnés
  errorMessage: string = '';

  timer$ = new BehaviorSubject<number>(this.timer);
  timerProgress$ = new BehaviorSubject<number>(this.timerProgress);

  jsonData = data.index_carte;

  constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private wsService: WebSocketService,
    private roomService: RoomService
  ) {}

  /* --------------------------
      INITIALISATION
  ----------------------------*/
  ngOnInit() {
    // 1. WebSocket setup (de lobby)
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

    // 4. Démarrer le timer (de main)
    this.startInfiniteTimer();
  }

  ngOnDestroy() {
    console.log('🧹 Nettoyage du composant Game');
    this.isDestroyed = true;

    // Cleanup timer
    clearInterval(this.intervalId);

    // Cleanup WebSocket subscriptions
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    if (this.publicSubscription) {
      this.publicSubscription.unsubscribe();
    }
  }

  /* --------------------------
      WEBSOCKET METHODS (de lobby)
  ----------------------------*/
  private loadGameState() {
    console.log('📡 Chargement de l\'état de la partie...');
    
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
  }

  private subscribeToGameEvents() {
    console.log('🔌 Abonnement aux événements de jeu...');

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
  }

  private handleGameMessage(data: any) {
    if (this.isDestroyed) return;

    console.log('📥 Type de message:', data.type);

    switch(data.type) {
      case 'GAME_STATE_UPDATE':
        console.log('🔄 Mise à jour de l\'état du jeu');
        if (data.gameState) {
          this.gameState = data.gameState;
        }
        break;

      case 'PLAYER_BET':
        console.log('💰 Pari reçu:', data.playerUuid, data.bet);
        const player = this.players.find(p => p.uuid === data.playerUuid);
        if (player) {
          player.bet = data.bet;
        }
        break;

      case 'CARD_PLAYED':
        console.log('🃏 Carte jouée par:', data.playerUuid);
        break;

      case 'ROUND_START':
        console.log('🎯 Nouvelle manche:', data.round);
        this.gameState.currentRound = data.round;
        this.gameState.phase = 'BETTING';
        break;

      case 'TURN_CHANGED':
        console.log('🔄 Tour du joueur:', data.playerUuid);
        this.gameState.currentTurn = data.playerUuid;
        break;

      case 'ROUND_END':
        console.log('🏁 Fin de manche');
        this.gameState.phase = 'ROUND_END';
        break;

      case 'GAME_END':
        console.log('🎊 Fin de partie !');
        this.gameState.phase = 'GAME_END';
        break;

      default:
        console.log('⚠️ Message non géré:', data.type);
    }
  }

  onBetPlaced(betAmount: number) {
    console.log('💰 Pari placé:', betAmount);

    this.wsService.sendLobbyMessage({
      type: 'PLACE_BET',
      bet: betAmount,
      roomUuid: this.roomUuid
    });

    const currentPlayer = this.players.find(p => p.uuid === this.playerUuid);
    if (currentPlayer) {
      currentPlayer.bet = betAmount;
    }

    this.gameState.phase = 'PLAYING';
  }

  leaveGame() {
    console.log('👋 Quitter la partie');
    
    this.wsService.sendLobbyMessage({
      type: 'LEAVE_GAME',
      roomUuid: this.roomUuid
    });

    this.router.navigate(['/']);
  }

  isMyTurn(): boolean {
    return this.gameState.currentTurn === this.playerUuid;
  }

  getCurrentPlayerName(): string {
    const player = this.players.find(p => p.uuid === this.gameState.currentTurn);
    return player ? player.name : 'Inconnu';
  }

  /* --------------------------
      TIMER METHODS (de main)
  ----------------------------*/
  startInfiniteTimer() {
    this.ngZone.run(() => {
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
          this.timerProgress = (this.timer / this.totalTime) * 100;

          this.timer$.next(this.timer);
          this.timerProgress$.next(this.timerProgress);
        } else {
          this.resetTimer();
        }
      }, 1000);
    });
  }

  resetTimer() {
    this.timer = this.totalTime;
    this.timerProgress = 100;
  }

  /* --------------------------
      GAME LOGIC (de main)
  ----------------------------*/
  onCardPlayed(cardId: number) {
    // Vérifier que c'est le tour du joueur (WebSocket)
    if (this.gameState.currentTurn !== this.playerUuid) {
      console.warn('⚠️ Ce n\'est pas votre tour !');
      return;
    }

    // Logique locale
    this.dropZoneCards.push(cardId);
    const index = this.handCards.indexOf(cardId);
    if (index > -1) this.handCards.splice(index, 1);

    // Envoyer au serveur via WebSocket
    this.wsService.sendLobbyMessage({
      type: 'PLAY_CARD',
      cardId: cardId,
      roomUuid: this.roomUuid
    });
  }

  onCardDropped(cardId: number) {
    this.onCardPlayed(cardId);
  }

  increaseScore(amount: number) {
    this.score += amount;
    this.scorePopped = true;
    setTimeout(() => (this.scorePopped = false), 400);
  }

  winTrick() {
    this.tricksWon++;
    this.increaseScore(20);
  }

  /* --------------------------
      CARD VALIDATION (de main)
  ----------------------------*/
  getPlayableCards(dropZoneCards: number[]): number[] {
    if (dropZoneCards.length === 0) {
      return [];
    }

    let i = 0;
    let type = this.jsonData.find(c => c.id === dropZoneCards[i])?.type;
    while (type === 'fuite' && i < dropZoneCards.length - 1) {
      i++;
      type = this.jsonData.find(c => c.id === dropZoneCards[i])?.type;
    }

    if (!type) return [];
    if (type === 'special') return [];

    if (this.handCards.filter(id => this.jsonData.find(c => c.id === id)?.type === type).length === 0) return [];

    const allowed = new Set([type, 'special', 'fuite']);
    return this.handCards.filter(id => {
      const t = this.jsonData.find(c => c.id === id)?.type;
      return !(t != null && allowed.has(t));
    });
  }

  get nonPlayableCards(): number[] {
    return this.getPlayableCards(this.dropZoneCards);
  }

  onCardPlayedError(errorMessage: string) {
    this.errorMessage = errorMessage;
    setTimeout(() => (this.errorMessage = ''), 3000);
  }
}