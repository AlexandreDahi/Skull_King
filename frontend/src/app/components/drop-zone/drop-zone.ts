import { Component, inject, input, model, ModelSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
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

      const card = this.wsService.convertCardNameFromBackToFront(message.card)

      const card_id = this.wsService.getCardIdFromCardName(card)

      if (card_id === undefined) {
        console.log("Card sent from server is not known : ", message.card)
        return
      }

      this.cardsInZone.update(value => {
        value.push(card_id)
        return value
      })
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

    let card_back = ''
    for (const card_front of this.cardData) {
      if (card_front.id === removedCard){

        const [num, color] = card_front.name.split(' ')

        let color_back
        switch (color) {
          case "violet":
            color_back = "purple"
            break
          case "jaune":
            color_back = "jaune"
            break
          case "noir":
            color_back = 'black'
            break
          case "vert":
            color_back = "green"
            break
        }

        card_back = color_back + ' ' + num
      }
    }

    
    console.log("sending card", card_back, "to the backend")
    this.wsService.sendCard(card_back)
    

    console.log("removed card : ", removedCard)
    previous.splice(event.item.data.index, 1)
    current.push(removedCard)
      
  }

}
