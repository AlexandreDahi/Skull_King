package com.example.skullking.entities.game;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.cards.Card;
import com.example.skullking.entities.game.cards.CardManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

public class GameState {

    private GamePhase currentPhase;
    private int currentRound = 1;
    private final Map<Player, Integer> bets = new HashMap<>();
    private final Map<Player, Card> cardPlayed = new HashMap<>();
    private final CardManager cardManager = new CardManager();
    Map<UUID,Player> players ;
    int NUMBER_OF_ROUND = 10;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private ScheduledFuture<?> scheduledTask;

    public boolean startGame(List<Player> players) {
        this.players = players.stream()
                .collect(Collectors.toMap(Player::getUuid, player -> player));
        return true;
    }

    public  boolean recordCardPlayed(UUID playerId, UUID uuidCardPlayed){
        Card cardPlayed = this.cardManager.playCard(playerId, uuidCardPlayed);
        if (cardPlayed == null){
            return false;
        }
        this.cardPlayed.put(players.get(playerId),cardPlayed);
        return true;
    }

    public boolean recordBet(UUID playerId, Integer bet){
        this.bets.put(players.get(playerId),bet);
        return false;
    }

    public void schedulePhaseTimeout(GamePhase phase, int seconds, Runnable onTimeOut) {
        this.scheduledTask =  scheduler.schedule(() -> {
            if (this.currentPhase == phase) {
                onTimeOut.run();
            }
        }, seconds, TimeUnit.SECONDS);
    }

    private void cancelTimer(){
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


}





