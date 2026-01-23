import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Cards } from '../cards/cards';


import { ws2Service } from '../../service/websocket/ws-2.service';
import data from '../cards/index_carte.json'

@Component({
  selector: 'app-drop-zone',
  standalone: true,
  imports: [CommonModule, DragDropModule, Cards],
  templateUrl: './drop-zone.html',
  styleUrl: './drop-zone.css',
})
export class DropZone {

  wsService = inject(ws2Service)

  @Input() cardsInZone: number[] = [];
  @Input() connectedLists: string[] = [];

  @Input() isMyTurn: boolean = false;

  cardData = data.index_carte;

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

        card_back = color + ' ' + num
      }
    }

    
    console.log("sending card", card_back, "to the backend")
    this.wsService.sendCard(card_back)
    

    console.log("removed card : ", removedCard)
    previous.splice(event.item.data.index, 1);
    current.push(removedCard);
  }

}
