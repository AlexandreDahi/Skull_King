import { Component, ViewChild, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


import { MatIconModule } from '@angular/material/icon';

import { Subscription, BehaviorSubject } from 'rxjs';


import { Hand } from '../../components/hand/hand';
import { DropZone } from '../../components/drop-zone/drop-zone';
import data_cards from '../../components/cards/index_carte.json';


import { HeadUpDisplay } from '../../components/hud/head-up-display/head-up-display';
import { PlayerPanel } from '../../components/hud/player-panel/player-panel';

import { WebSocketService } from '../../service/websocket/websocket.service';
import { RoomService } from '../../service/room/room.service';

interface Player {
  uuid: string;
  name: string;
  score?: number;
  bet?: number;
  obtained?: number;

}

interface GameState {
  roundNumber: number;
  turnNumber: number;
  currentTurnPlayer: string; // UUID du joueur dont c'est le tour
  currentPlayerOrder: string[]; // Ordre des joueurs pour la manche en cours
  // phase: 'GIVING_CARD' | 'BETTING' | 'PLAYING' | 'ROUND_END' | 'GAME_END';
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
  handCards: number[] = [];
  dropZoneCards: number[] = [];
  isPlayerTurn: boolean = false;

  round : number = 1;
  totalRounds: number = 10;

  
  phase: string = "Phase d'attente des joueurs"; // affiché en haut

  timer: number = 40;
  totalTime: number = 40;
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

  /* --- WEBSOCKET DATA (de lobby) --- */
  roomUuid: string = '';
  playerUuid: string = '';
  playerSelf: Player | null = null;  // Notre joueur
  otherPlayers: Player[] = [];         // Les autres joueurs
  gameState: GameState = {
    roundNumber: 1,
    turnNumber: 1,
    currentTurnPlayer: '',
    currentPlayerOrder: [],
    // phase: 'GIVING_CARD'
  };
  
  // Abonnements WebSocket
  private gameSubscription?: Subscription;
  private publicSubscription?: Subscription;
  private isDestroyed = false;

  /* --- GAME LOGIC DATA (de main) --- */
 

  jsonData_cards = data_cards.index_carte;

  constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private wsService: WebSocketService,
    private roomService: RoomService,
  ) {}

  /* --------------------------
      INITIALISATION
  ----------------------------*/
  ngOnInit() {
    // relancé la websocket en cas de crach :
    this.wsService.reconnectIfPossible();
    
    // 1. WebSocket setup (de lobby)
    this.roomUuid = this.route.snapshot.paramMap.get('id') || '';

    if (!this.roomUuid) {
      console.error('❌ Pas de room UUID, retour à l\'accueil');
      this.router.navigate(['/']);
      return;
    }
    // ✅ ATTENDRE que les infos du joueur arrivent AVANT de continuer
    this.wsService.playerInfoReady$.subscribe(() => {

      this.playerUuid = this.wsService.getPlayerUuid();
      console.log('🎮 === GAME INIT ===');
      console.log('Room UUID:', this.roomUuid);
      console.log('playerUuid:', this.playerUuid);

      // 1. S'abonner aux événements de jeu via WebSocket
      this.subscribeToGameEvents();
      this.subscribeToPrivateEvents();
      
      // 2. Démarrer le timer
      this.startInfiniteTimer();

      // 3. Récupérer les infos de la parite en cours (cartes en main, état du jeu, etc.)
      console.log('🚀 Récupéré toutes les infos en cours de la parites depuis le backend');
      this.wsService.sendGameMessage({
        type: 'game_info'
      });
    });
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
  // S'abonner aux événements de jeu via WebSocket
  //
  private subscribeToGameEvents() {
    console.log('🔌 Abonnement aux événements de jeu chanel publique...');

    this.publicSubscription = this.wsService.getPublicChannel().subscribe({
      next: (message) => {
        if (this.isDestroyed) return;
        
        console.log('📢 Message public reçu:', message);
        this.handleGameMessage(message);
      },
      error: (err) => console.error('❌ Erreur canal public:', err)
    });
  }
  private subscribeToPrivateEvents() {
     console.log('🔌 Abonnement aux événements de jeu chanel perso...');

    this.gameSubscription = this.wsService.getPrivateChannel().subscribe({
      next: (message) => {
        if (this.isDestroyed) return;
        
        console.log('📢 Message privé reçu:', message);
        this.handlePrivateMessage(message);
      },
      error: (err) => console.error('❌ Erreur canal privé:', err)
    });
  }
  private handlePrivateMessage(data: any) {
    if (this.isDestroyed) return;
    console.log('📥 Type de message privé:', data.type);
    switch(data.type) {
      case 'GAME_INFO_EVENT':
        console.log('🃏 Réception des informations du jeu:', data);
        this.handCards = data.cards || [];
        console.log('✅ Cartes en main:', this.handCards);
        this.dropZoneCards = data.turn_cards || [];
        console.log('✅ Cartes sur la table:', this.dropZoneCards);
        this.gameState.roundNumber = data.current_round ;
        this.gameState.turnNumber = data.current_turn  ;
        this.gameState.currentTurnPlayer = data.current_player;
        this.gameState.currentPlayerOrder = data.current_players_order;
        console.log('✅ État du jeu:', this.gameState);

        // Récupérer et séparer les joueurs

        if (data.players && Array.isArray(data.players)) {
          const allPlayers: Player[] = data.players.map((p: any) => ({
            uuid: p.uuid || p.get('uuid'),
            name: p.name || p.get('name'),
            score: p.score || 0,
            bet: p.bet ?? null,
            obtained: p.obtained || 0
          }));
          this.playerSelf = allPlayers.find((p: Player) => p.uuid === this.playerUuid) || null;
          this.otherPlayers = allPlayers.filter((p: Player) => p.uuid !== this.playerUuid);

          console.log('✅ Joueur courant:', this.playerSelf);
          console.log('✅ Autres joueurs:', this.otherPlayers);
        }
        break;
      default:
      console.log('⚠️ Message non géré par private message:', data.type);
    }
  }

  private handleGameMessage(data: any) {
    if (this.isDestroyed) return;

    console.log('📥 Type de message:', data.type);

    switch(data.type) {
      case 'BET_PLACED_EVENT':
        console.log('💰 Un joueur a placé une mise:',data.message);
        break;
      case 'ROUND_START_EVENT':
        console.log('🎯 Nouvelle manche commencée !', data.message);
        const turn_bet = data.turn_bet || [];
        turn_bet.forEach((tb: any) => { const player = this.otherPlayers.find(p => p.uuid === tb[0]); if (player) { player.bet = tb[1]; } });

        break;

      case 'GAME_STATE_UPDATE':
        console.log('🔄 Mise à jour de l\'état du jeu');
        if (data.gameState) {
          this.gameState = data.gameState;
        }
        break;
      
      case 'NEW_ROUND':
        console.log('🎯 Nouvelle manche !');
        // Seulement l'admin demande la distribution des cartes
        if (this.wsService.isAdmin()) {
          this.wsService.sendGameMessage({
            type: 'GIVING_CARD'
          });
        }
        break;

      default:
        console.log('⚠️ Message non géré:', data.type);
    }
  }

  
  onCardDropped(cardId: number) {
    console.log("🃏 Carte déposée :", cardId);
    
    // Vérifier que c'est bien le tour du joueur
    if (this.gameState.currentTurnPlayer !== this.playerUuid) {
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

  // Logique d'envoie de la mise au serveur via WebSocket
  onBetPlaced(betAmount: number) {
    console.log('💰 Pari placé:', betAmount);

    if (this.playerSelf) {
      this.playerSelf.bet = betAmount;
      console.log('✅ Mise mise à jour pour playerSelf:', this.playerSelf.bet);
    }
    this.wsService.sendGameMessage({
      type: 'place_bet',
      bet: betAmount,
    });
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
    // Vérifier que c'est le tour du joueur (WebSocket)
    if (this.gameState.currentTurnPlayer !== this.playerUuid) {
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
    this.increaseScore(20);
  }
  // --------------------------
  //    Restreint les cartes jouables
  //----------------------------
  

  /* --------------------------
      CARD VALIDATION (de main)
  ----------------------------*/
  getPlayableCards(dropZoneCards: number[]): number[] {

  // Si c'est pas le tour du joueur, les cartes ne sont pas jouables
    if (this.isPlayerTurn === false) {
      return this.handCards;
    }
  // Si la zone de drop est vide, toutes les cartes sont jouables
    if (dropZoneCards.length === 0) {
      return [];
    }
  // Tant que la première carte est de type fuite, toutes les cartes sont jouables
    let i = 0;
    let type = this.jsonData_cards.find(c => c.id === dropZoneCards[i])?.type;
    while (type === 'fuite' && i < dropZoneCards.length - 1) {
      i++;
      type = this.jsonData_cards.find(c => c.id === dropZoneCards[i])?.type;
    }
  // Si la carte n'a pas de type, toutes les cartes sont jouables
    if (!type) return [];
  // Si la première carte est de type spécial, toutes les cartes sont jouables
    if (type === 'special') return [];

  // Filtrer les cartes qui ne correspondent pas au type requis
    if (this.handCards.filter(id => this.jsonData_cards.find(c => c.id === id)?.type === type).length === 0) return [];

    const allowed = new Set([type, 'special', 'fuite']);
    return this.handCards.filter(id => {
      const t = this.jsonData_cards.find(c => c.id === id)?.type;
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
