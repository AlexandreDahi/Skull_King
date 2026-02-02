import { Component, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Cards } from '../cards/cards';


import { webSocketService } from '../../service/websocket/websocket.service';
import data from '../cards/index_carte.json'

@Component({
  selector: 'app-drop-zone',
  standalone: true,
  imports: [CommonModule, DragDropModule, Cards],
  templateUrl: './drop-zone.html',
  styleUrl: './drop-zone.css',
})
export class DropZone {

  wsService = inject(webSocketService)

  cardsInZone =  model<number[]>([])

  isMyTurn = signal(false)

  cardData = data.index_carte;

  constructor(){
    this.wsService.onCardPlayed((message: any) => {

      if (this.isMyTurn()) {
        // This block prevent the card played being displayed twice
        // i.e. once when the user drag and drop the card and once 
        // when the server broadcast the card played
        this.isMyTurn.set(false)
        return
      }

      if (message.card === undefined) {
        console.log("Card sent from server is not known : ", message.card)
        return
      }

      const cardsPlayed = [...this.cardsInZone(), message.card]
      this.cardsInZone.set(cardsPlayed)
    })

    this.wsService.onTrickWinner((message: any) => {
      this.cardsInZone.set([])
    })

    this.wsService.onAskCardEvent((message: any) => {

      if (message.current_player === this.wsService.getPlayerUuid()) {
        this.isMyTurn.set(true)
      }

    })
  }

  onDrop(event: CdkDragDrop<number[]>) {
    
    if (event.previousContainer === event.container) return;

    const previous = event.previousContainer.data;
    const current = event.container.data;

    const removedCard = previous[event.item.data.index];

    
    this.wsService.sendCard(removedCard)
    

    previous.splice(event.item.data.index, 1)
    current.push(removedCard)
      
  }

}
