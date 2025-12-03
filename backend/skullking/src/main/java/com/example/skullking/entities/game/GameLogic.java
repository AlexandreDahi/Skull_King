package com.example.skullking.entities.game;

import com.example.skullking.entities.game.cards.Card;
import com.example.skullking.entities.game.cards.CardType;
import com.example.skullking.entities.game.cards.Hand;

import java.util.List;
import java.util.Map;

public class GameLogic {


    public boolean isCardPlayedLegal(List<Card> cardsPlayed, Card cardChosen, Hand playerHand){
        CardType typeToPlay = this.getHandCardType(cardsPlayed);
        if (typeToPlay == null){
            return true;
        }
        else if( typeToPlay.equals(CardType.special)) {
            return true;
        }
        else {
            boolean isDifferentType = !cardChosen.getCardTypes().contains(typeToPlay) ;
            boolean notSameTypeInHand = this.doesCardTypeExistInHand(playerHand,typeToPlay);
            if (isDifferentType && notSameTypeInHand){
                return true;
            }
        }
        return false;
    }
    public int getPointWonInTricks(List<Card> cardsPlayed){
        return 0;
    }

    private boolean doesCardTypeExistInHand(Hand playerHand, CardType typeToPlay) {
        Map<Integer,Card> playerCards = playerHand.getCards();
        if (playerHand == null || playerCards.isEmpty()) {
            return false;
        }

        for (Map.Entry<Integer,Card> card : playerCards.entrySet()) {
            if (card.getValue().getCardTypes().contains(typeToPlay)) {
                return true;
            }
        }
        return false;
    }

    private CardType getHandCardType(List<Card> cardsPlayed){
        for (Card cardPlayed : cardsPlayed){
           if (cardPlayed.isFlee() == false){
               return CardType.special;
           }
        }
        return null;
    }

}
