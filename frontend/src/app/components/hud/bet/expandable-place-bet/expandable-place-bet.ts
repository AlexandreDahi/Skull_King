import { Component, inject, signal } from '@angular/core';
import { PlaceBet } from '../place-bet/place-bet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { ws2Service } from '../../../../service/websocket/ws-2.service';

@Component({
  selector: 'app-expandable-place-bet',
  imports: [MatExpansionModule, PlaceBet,MatIconModule,CommonModule],
  templateUrl: './expandable-place-bet.html',
  styleUrl: './expandable-place-bet.css',
})
export class ExpandablePlaceBet {

  wsService = inject(ws2Service)

  isExpanded = signal(false);

  constructor() {
    this.wsService.onNewRoundEvent((message: any) => {

      this.isExpanded.set(true)

    })
  }

  toggleExpand() {
    console.log("Expanding place bet")
    this.isExpanded.update(isExpanded => !isExpanded)
  }




}
