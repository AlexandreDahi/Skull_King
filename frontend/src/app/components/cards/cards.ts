import { Component, Input } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import data from './index_carte.json';

@Component({
  selector: 'app-cards',
  standalone: true,
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  imports: [DragDropModule],
})
export class Cards {

  @Input() id!: number;

  jsonData = data.index_carte;
  card: any;

  ngOnInit() {
    this.card = this.jsonData.find(c => c.id === this.id);
  }
}
