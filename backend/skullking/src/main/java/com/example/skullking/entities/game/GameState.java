package com.example.skullking.entities.game;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.cards.Card;
import com.example.skullking.entities.game.cards.CardManager;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

public class GameState {

    private GamePhase currentPhase;
    private int currentRound = 1;
    private final Map<Player, Integer> bets = new HashMap<>();
    private final Map<Player, Card> cardPlayed = new LinkedHashMap<>();
    private final Map<Player,Integer> roundWon = new HashMap<>();

    private final CardManager cardManager = new CardManager();
    private final GameLogic gameLogic = new GameLogic();
    Map<UUID,Player> players ;
    int NUMBER_OF_ROUND = 10;

    //private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private ScheduledFuture<?> scheduledTask;

    public boolean startGame(List<Player> players) {
        this.players = players.stream()
                .collect(Collectors.toMap(Player::getUuid, player -> player));
        return true;
    }

    public  boolean recordCardPlayed(UUID playerId, int uuidCardPlayed){
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
        this.bets.put(players.get(playerId),bet);
        return false;
    }

    /*public void schedulePhaseTimeout(GamePhase phase, int seconds, Runnable onTimeOut) {
        this.scheduledTask =  scheduler.schedule(() -> {
            if (this.currentPhase == phase) {
                onTimeOut.run();
            }
        }, seconds, TimeUnit.SECONDS);
    }*/

    public void cancelTimer(){
        if(this.scheduledTask != null) {
            this.scheduledTask.cancel(false);
        }
    }



    public boolean isPhaseFinished(){
        if (this.currentPhase.equals(GamePhase.Betting)){
            return players.size() == bets.size();
        } else if (this.currentPhase.equals(GamePhase.Playing)) {
            return players.size() == cardPlayed.size();
        }
        return false;
    }

    public GamePhase getCurrentPhase() { return this.currentPhase; }
    public void setCurrentPhase(GamePhase phase) { this.currentPhase = phase; }
    public void nextRound() { this.currentRound++; }
    public boolean isGameOver() {return currentRound > 10; }


    public void endPlayingPhase() {
        
    }

    public boolean isRoundFinished() {

        return false;
    }

    public void setScheduledTask(ScheduledFuture<?> scheduledTask) {
        this.scheduledTask = scheduledTask;
    }

    public void cancelScheduledTask() {

        if (this.scheduledTask != null){
            this.scheduledTask.cancel(true);
            this.scheduledTask = null;
        }
    }

    public boolean hasEveryoneBet() {
        return players.size() == bets.size();
    }
}





