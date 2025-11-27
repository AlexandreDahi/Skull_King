import { Component, Input } from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
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

  // Le JSON complet importé
  jsonData = data.index_carte;

  // La carte sélectionnée
  card: any;

  ngOnInit() {
    this.card = this.getCardById(this.id);
    console.log("Card créée ID =", this.id, " → ", this.card);
  }

  // 🔎 Fonction qui récupère une carte par son ID
  getCardById(id: number) {
    return this.jsonData.find(carte => carte.id === id);
  }
}
