package com.example.skullking.entities.game.cards;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Hand {
    Map<UUID, Card> cards = new HashMap<>();
    public boolean addCard(Card removedCard) {
        this.cards.put(removedCard.id,removedCard);
        return true;
    }
}
