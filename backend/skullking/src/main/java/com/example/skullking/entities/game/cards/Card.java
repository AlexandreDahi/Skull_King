package com.example.skullking.entities.game.cards;

import java.util.List;
import java.util.UUID;

public class Card {
    int id;
    List<CardType> cardTypes;
    CardSuite suite;
    int number;

    public Card(int id, List<CardType> cardTypes,CardSuite suite) {
        this.id = id;
        this.cardTypes = cardTypes;
        this.suite = suite;
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

    public int getNumber() {
        return number;
    }

    public boolean isFlee() {
        return this.cardTypes.contains("doNotDecideSuit");
    }
}
