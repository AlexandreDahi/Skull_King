package com.example.skullking.entities.game.cards;

import java.util.*;

public class Deck {
    private Random random = new Random();
    private DeckBuilder deckBuilder = new DeckBuilder();
    Map<Integer, Card> cards = this.deckBuilder.build();
    //public List<Card> cards = new ArrayList<>((Collection) this.deckBuilder.build());

    public Card removeRandomCard() {
        if (cards.isEmpty()) {
            return null;
        }
        // Convert keys to a list to avoid issues with non-contiguous keys
        List<Integer> keys = new ArrayList<>(cards.keySet());
        int randomIndex = random.nextInt(keys.size());
        return cards.remove(keys.get(randomIndex));
    }

}
