package com.example.skullking.entities.game.cards;

import java.util.Map;
import java.util.Random;
import java.util.UUID;

public class Deck {
    private Random random = new Random();
    private DeckBuilder deckBuilder = new DeckBuilder();
    Map<Integer, Card> cards;
    private void buildDeck(){
        this.cards = this.deckBuilder.build();
    }
    public Card removeRandomCard(){
        int randomIndex = random.nextInt(cards.size());
        if (cards.containsKey(randomIndex)){
            return cards.remove(randomIndex);
        }
        return null;

    }

}
