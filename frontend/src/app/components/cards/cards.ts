import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import data from './index_carte.json';

@Component({
  selector: 'app-cards',
  standalone: true,
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  imports: [CommonModule],
})
export class Cards {

  @Input() id!: number;

  jsonData = data.index_carte;
  card: any;

  ngOnInit() {
    this.card = this.jsonData.find(c => c.id === this.id);
  }

  isCardSpecial(card: any): boolean {
    if (!card) return false;
    return card.type === 'special' || card.type === 'fuite';
  }

}
