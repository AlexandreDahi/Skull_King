import { Component, inject, input, signal } from '@angular/core';
import { webSocketService } from '../../../../service/websocket/websocket.service';

@Component({
  selector: 'app-other-player',
  templateUrl: './other-player.html',
  imports:[],
  styleUrls: ['./other-player.css'],
})
export class OtherPlayer {

  private wsService = inject(webSocketService)

  playerUuid = input("")
  playerName = signal("")
  playerBet = signal(0)
  playerTricksWon = signal(0)


  ngOnInit() {

    const playersList = this.wsService.getPlayersName()

    for (const player of playersList) {
      if (player.uuid === this.playerUuid()) {
        this.playerName.set(player.name)
      }
    }

    this.wsService.onBetRevealEvent((message:any) => {

      for (const playerBet of message.bets) {
        if (playerBet.uuid === this.playerUuid()) {
          this.playerBet.set(playerBet.bet)
          this.playerTricksWon.set(0)
          break
        }
      }
    })

    this.wsService.onTrickWinner((message: any) => {
      if (message.winner === this.playerUuid()) {
        this.playerTricksWon.update((score) => score + 1)
      }
    })
    
  }

  name() {

    if (this.wsService.getPlayerUuid() === this.playerUuid()) {
      return this.playerName() + " (Vous)"
    } 
    else {
      return this.playerName()
    }
  }
  
}
