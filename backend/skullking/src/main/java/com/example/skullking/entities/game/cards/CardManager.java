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
        boolean success = true;
        for (int i=0  ; i < numberOfCards ; i++){
            if (numberOfCards <= deck.cards.size()) {
                success = this.drawCard(playerId);
            }else{
                success = false;
            }
            if (!success) {
                System.out.println("draw card i failed");
                return false;
            }
        }
        return true;
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
