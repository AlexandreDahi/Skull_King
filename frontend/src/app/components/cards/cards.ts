import { Component, Input } from '@angular/core';
import data from './index_carte.json';

@Component({
  selector: 'app-cards',
  standalone: true,
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  imports: [],
})
export class Cards {

  @Input() id!: number;

  jsonData = data.index_carte;
  card: any;

  ngOnInit() {
    this.card = this.jsonData.find(c => c.id === this.id);
  }
}
