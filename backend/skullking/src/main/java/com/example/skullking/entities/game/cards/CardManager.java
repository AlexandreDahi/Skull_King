package com.example.skullking.entities.game.cards;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class CardManager {
    Deck deck = new Deck();
    Map<UUID,Hand> playerHands = new HashMap<>();


    public boolean drawCard(UUID playerId){
        Card removedCard = this.deck.removeRandomCard();
        if (removedCard == null){
            return false;
        }
        else if (!playerHands.containsKey(playerId)){
            Hand hand = new Hand();
            this.playerHands.put(playerId, hand);
        }
            Hand hand = this.playerHands.get(playerId);
            return hand.addCard(removedCard);

    }

    public boolean drawHand(UUID playerId, int numberOfCards){
        if (numberOfCards <= deck.cards.size()){
            for (int i=0  ; i < numberOfCards ; i++){
                this.drawCard(playerId);
            }
            return true;
        }
        return false;
    }
    public Card playCard(UUID playerId, int cardId){
        if (!playerHands.containsKey(playerId)){
            return null;
        } else  {
            Hand hand = playerHands.get(playerId);
            return hand.cards.getOrDefault(cardId, null);
        }
    }

    public Hand getPlayerHand(UUID playerId){
        return playerHands.getOrDefault(playerId, null);
    }

}
