package com.example.skullking.entities.game;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.cards.Card;
import com.example.skullking.entities.game.cards.CardManager;
import com.example.skullking.entities.game.cards.Hand;
import com.example.skullking.entities.game.cards.TrickResult;

import java.util.*;
import java.util.stream.Collectors;

public class GameState {


    private int currentRound = 1;
    private final Map<Player, Integer> bets = new HashMap<>();
    private final LinkedHashMap<Player, Card> cardPlayed = new LinkedHashMap<>();
    private final Map<Player,Integer> roundWon = new HashMap<>();
    private final Map<Player,Integer> points = new HashMap<>();
    private final CardManager cardManager = new CardManager();
    private final GameLogic gameLogic = new GameLogic();
    Map<UUID,Player> players ;


    public boolean startGame(List<Player> players) {
        this.players = players.stream()
                .collect(Collectors.toMap(Player::getUuid, player -> player));
        return true;
    }

    public boolean recordCardPlayed(UUID playerId, int uuidCardPlayed){
        Card cardChosen = this.cardManager.playCard(playerId, uuidCardPlayed);
        List<Card> cardPlayed = new ArrayList<>(this.cardPlayed.values());
        if (cardPlayed == null){
            return false;
        }
        if (this.gameLogic.isCardPlayedLegal(cardPlayed, cardChosen,this.cardManager.getPlayerHand(playerId))){
            this.cardPlayed.put(players.get(playerId),cardChosen);
            return true;
        }
        return false;
    }

    public boolean recordBet(UUID playerId, Integer bet){
        if (players.containsKey(playerId)){
            this.bets.put(players.get(playerId),bet);
            return true;
        }
        return false;
    }



    public boolean givePlayersCard() {
        for (Map.Entry<UUID,Player> players : players.entrySet()){
            cardManager.drawHand(players.getKey(),10);
            Hand hand = cardManager.getPlayerHand(players.getKey());
            if (hand == null){
                return false;
            }
            // distrubute hands
        }
        return true;
    }

    public boolean calculateScores() {

    }
}





