package com.example.skullking.entities.game.cards;

import java.util.List;
import java.util.UUID;

public class Card {
    int id;
    List<CardType> cardTypes;
    CardSuite suite;

    public Card(int id, String type) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public List<CardType>  getCardTypes() {
        return cardTypes;
    }

    public CardSuite getSuite() {
        return suite;
    }

    public boolean isFlee() {
        return this.cardTypes.contains("doNotDecideSuit");
    }
}
