package com.example.skullking.entities.game.cards;

import java.util.Map;
import java.util.UUID;

public class CardManager {
    Deck deck;
    Map<UUID,Hand> playerHands;


    public boolean drawCard(UUID playerId){
        Card removedCard = this.deck.removeRandomCard();
        if (removedCard == null){
            return false;
        }
        else if (!playerHands.containsKey(playerId)){
            return false;
        }
        else{
            Hand hand = this.playerHands.get(playerId);
            hand.addCard(removedCard);
            return true;
        }
    }

    public boolean drawHand(UUID playerId, int numberOfCards){
        if (playerHands.containsKey(playerId) && numberOfCards <= deck.cards.size()){
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
        if (!playerHands.containsKey(playerId)){
            return null;
        } else  {
            return playerHands.get(playerId);
        }
    }

}
