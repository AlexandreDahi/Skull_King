import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { webSocketService } from '../../../../service/websocket/websocket.service';


@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {

  wsService = inject(webSocketService)

  scores = signal<{name: string, uuid: string, score: number}[]>([])
  
  ngOnInit() {

    const players = this.wsService.getPlayersName()

    for (const player of players) {
      this.scores.update( (values) => {
        values.push({name: player.name, uuid: player.uuid, score: 0})
        return values
      })
    }


    this.wsService.onRoundScores((message: any) => {
      //for (const roundPlayerInfo of message.scores) {

        for (const player of this.scores()) {
          //if (roundPlayerInfo.uuid === player.uuid) {
            player.score += message.scores[player.uuid]
            //break
          //}
        }
      //}

      this.scores.update((values) => values) // notify angular to update the view
    })

  }

}
