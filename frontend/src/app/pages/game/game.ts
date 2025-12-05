import { Component, ViewChild, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


import { MatIconModule } from '@angular/material/icon';

import { Subscription, BehaviorSubject } from 'rxjs';


import { Hand } from '../../components/hand/hand';
import { DropZone } from '../../components/drop-zone/drop-zone';
import data from '../../components/cards/index_carte.json';


import { HeadUpDisplay } from '../../components/hud/head-up-display/head-up-display';
import { PlayerPanel } from '../../components/hud/player-panel/player-panel';

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
  imports: [Hand, CommonModule,  MatIconModule, PlayerPanel, HeadUpDisplay, DropZone],
  templateUrl: './game.html',
  styleUrl: './game.css',
  standalone: true
})
export class Game implements OnInit, OnDestroy {

  // --- GAME DATA ---  //
  handCards: number[] = [24, 3, 15, 65, 42,68,72,4,8,12];
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
  errorMessage: string ='';




  timer$ = new BehaviorSubject<number>(this.timer);
  timerProgress$ = new BehaviorSubject<number>(this.timerProgress);
  


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
    private roomService: RoomService,
    private ngZone: NgZone
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


    // 4. 
    this.startInfiniteTimer();
  }

  startInfiniteTimer() {
    this.ngZone.run(() => {
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
          this.timerProgress = (this.timer / this.totalTime) * 100;

          // met à jour les Observables
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


  //
  // Charger l'état initial de la partie via l'API
  //
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

  //
  // S'abonner aux événements de jeu via WebSocket
  //
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
    //this.hand.removeCard(cardId);
  }

  
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

  
  isMyTurn(): boolean {
    return this.gameState.currentTurn === this.playerUuid;
  }

  
  getCurrentPlayerName(): string {
    const player = this.players.find(p => p.uuid === this.gameState.currentTurn);
    return player ? player.name : 'Inconnu';
  }

  
  ngOnDestroy() {
    console.log('🧹 Nettoyage du composant Game');
    this.isDestroyed = true;

    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    if (this.publicSubscription) {
      this.publicSubscription.unsubscribe();
    }


    clearInterval(this.intervalId);
  }

  // --------------------------
  //    JOUER UNE CARTE
  //----------------------------
  onCardPlayed(cardId: number) {
    this.dropZoneCards.push(cardId);

    const index = this.handCards.indexOf(cardId);
    if (index > -1) this.handCards.splice(index, 1);
  }

  // --------------------------
  //    SCORE ANIMATION POP
  //----------------------------
  increaseScore(amount: number) {
    this.score += amount;

    this.scorePopped = true;
    setTimeout(() => (this.scorePopped = false), 400);
  }


  // --------------------------
  //    GAGNER UN PLI
  //----------------------------
  winTrick() {
    this.tricksWon++;
    this.increaseScore(20); // exemple
  }
  // --------------------------
  //    Restreint les cartes jouables
  //----------------------------
  jsonData = data.index_carte;

  getPlayableCards(dropZoneCards: number[]): number[] {
    if (dropZoneCards.length === 0) {
      return [];
    }
    // cherche le premier type non 'fuite' parmi les cartes du drop zone (si toutes 'fuite', on garde la dernière trouvée)
    let i = 0;
    let type = this.jsonData.find(c => c.id === dropZoneCards[i])?.type;
    while (type === 'fuite' && i < dropZoneCards.length - 1) {
      i++;
      type = this.jsonData.find(c => c.id === dropZoneCards[i])?.type;
    }

    if (!type) return [];

    if (type === 'special') return [];

    // ...existing code...
    if (this.handCards.filter(id => this.jsonData.find(c => c.id === id)?.type === type).length === 0) return [];

    // autorise les cartes du même type que la carte leader + toujours 'speciale' et 'fuite'
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
    // Optionnel : effacer le message après 3 secondes
    setTimeout(() => (this.errorMessage = ''), 3000);
  }
}
