package com.example.skullking.entities.game;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.cards.Card;
import com.example.skullking.entities.game.cards.CardType;
import com.example.skullking.entities.game.cards.Hand;
import com.example.skullking.entities.game.cards.TrickResult;

import java.util.ArrayList;
import java.util.LinkedHashMap;
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


    public TrickResult getTrickResult(LinkedHashMap<Player, Card> cardPlayed){
        int points = this.getFourteenBonusPoints(cardPlayed);
        CardType lastBeast =  this.lastBeastInTrick(cardPlayed);
        if ( lastBeast == CardType.kraken ){
            return new TrickResult(0,null);
        } else if ( lastBeast == CardType.whale) {
            Player winningPlayer = this.getWhoPlayedHighestNumber( cardPlayed );
            return new TrickResult(points + points,winningPlayer);
        } else if (this.containCardType(cardPlayed,CardType.special) !=0){
            TrickResult result = this.handleSpecials(cardPlayed);
            return new TrickResult(result.getGoldAmount()+points, result.getPlayer());
        } else {
            List<Card> cards = new ArrayList<>(cardPlayed.values());
            CardType typeToPlay = this.getHandCardType(cards);
            LinkedHashMap<Player, Card> colorCards = new LinkedHashMap<Player, Card>();

            for (Map.Entry<Player,Card> entry : cardPlayed.entrySet()){
                if (entry.getValue().getCardTypes().contains(typeToPlay)){
                    colorCards.put(entry.getKey(),entry.getValue());
                }
            }
            Player winningPlayer = this.getWhoPlayedHighestNumber(colorCards);
            return new TrickResult(points,winningPlayer);
        }
    }


    private TrickResult handleSpecials(LinkedHashMap<Player, Card> cardPlayed){
        int numberPirate = this.containCardType(cardPlayed,CardType.pirate);
        int numberMermaid = this.containCardType(cardPlayed, CardType.mermaid);
        int skullKing = this.containCardType(cardPlayed,CardType.skullKing);

        Player player;
        
        if (numberPirate !=0 && numberMermaid !=0 && skullKing !=0){
            player = getFirstPlayerWithType(cardPlayed,CardType.mermaid);
            return new TrickResult(40,player);
        } else if ( skullKing !=0 ) {
            player = getFirstPlayerWithType(cardPlayed,CardType.skullKing);
            return new TrickResult(numberPirate * 30,player);
        } else if (numberPirate !=0) {
            player = getFirstPlayerWithType(cardPlayed,CardType.pirate);
            return new TrickResult(numberMermaid * 20,player);
        }else if (numberMermaid !=0) {
            player = getFirstPlayerWithType(cardPlayed,CardType.mermaid);
            return new TrickResult(40,player);
        }
        return null;
    }
    
    private Player getFirstPlayerWithType(LinkedHashMap<Player, Card> cardPlayed, CardType cardType){
        for (Map.Entry<Player,Card> entry : cardPlayed.entrySet()){
            List<CardType> types = entry.getValue().getCardTypes();
            if (types.contains(cardType)){
                return entry.getKey();
            }
        }
        return null;
    }
    
    private int containCardType(LinkedHashMap<Player, Card> cardPlayed, CardType cardType){
        int numberCardType = 0;
        
        for (Map.Entry<Player,Card> entry : cardPlayed.entrySet()){
            List<CardType> types = entry.getValue().getCardTypes();
            if (types.contains(cardType)){
                numberCardType +=1;
            } 
        }
        return numberCardType;
        
    }
    
    private int getFourteenBonusPoints(LinkedHashMap<Player, Card> cardPlayed){
        int points = 0;
        for (Map.Entry<Player,Card> entry : cardPlayed.entrySet()){
            int cardNumber = entry.getValue().getNumber();
            if ( cardNumber == 14 ){
                if (entry.getValue().getCardTypes().contains(CardType.noir)){
                    points += 20;
                }
                else{
                    points +=10;
                }
            }
        }
        return points;
    }
    private Player getWhoPlayedHighestNumber(LinkedHashMap<Player, Card> cardPlayed) {
        int min = 0;
        Player whoPlayedHighestNumber = null;
        for (Map.Entry<Player,Card> entry : cardPlayed.entrySet()){
            Card playerCard = entry.getValue();
            if (playerCard.getNumber() > min){
                min = playerCard.getNumber();
                whoPlayedHighestNumber = entry.getKey();
            }
        }
        return whoPlayedHighestNumber;
    }

    private CardType lastBeastInTrick(LinkedHashMap<Player, Card> cardPlayed){
        CardType lastBeast = null;
        for (Map.Entry<Player,Card> entry : cardPlayed.entrySet()){
            List<CardType> types = entry.getValue().getCardTypes();
            if (types.contains(CardType.kraken)){
                lastBeast = CardType.kraken;
            } else if ((types.contains(CardType.whale))) {
                lastBeast = CardType.whale;
            }
        }
        return lastBeast;
    }
    private Player getHighestPersonWin(LinkedHashMap<Player, Card> cardPlayed ) {
        return null;
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
