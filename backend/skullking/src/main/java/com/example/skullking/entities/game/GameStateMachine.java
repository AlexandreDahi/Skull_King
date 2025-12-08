package com.example.skullking.entities.game;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.cards.TrickResult;
import com.example.skullking.entities.game.dto.BetPlayer;
import com.example.skullking.entities.game.dto.CardPlayer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class GameStateMachine {
    private ScheduledExecutorService scheduler;


    GameState gameState;
    private SimpMessagingTemplate webSocket;


    public GameStateMachine() {

        this.gameState = new GameState();
    }



    private GamePhase currentPhase;
    int NUMBER_OF_ROUND = 10;


    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private ScheduledFuture<?> scheduledTask;

    public boolean startGame(List<Player> players){
        startBettingPhase();
        return this.gameState.startGame(players);
    }

    public boolean receiveBetPlayer(BetPlayer betPlayer) {
        if (this.getCurrentPhase() != GamePhase.Betting) {
            return false;
        }
        boolean recordBetResult = gameState.recordBet(betPlayer.getPlayerId(), betPlayer.getBetAmount());
        if ( this.isPhaseFinished()){
            this.endBettingPhase();
            this.cancelTimer();
        }
        //broadcastGameState(" placed a bet of " + betPlayer);
        return recordBetResult;
    }

    public boolean receiveCardPlayer(CardPlayer cardPlayer) {
        if (this.getCurrentPhase() != GamePhase.Playing) {
            throw new IllegalStateException("Not in playing phase!");
        }

        gameState.recordCardPlayed(cardPlayer.getPlayerId(), cardPlayer.getCardId());

        if( this.isPhaseFinished()){
            this.endPlayingPhase();
            this.cancelTimer();
        }
        //broadcastGameState(" placed a bet of " + GamePhase);
        return true;
    }



    private boolean startBettingPhase(){
        //Broadcast that i need bets
        this.setCurrentPhase(GamePhase.Betting);
        this.schedulePhaseTimeout(GamePhase.Betting,this.BETTING_ROUND_MAX_DURATION, this::endBettingPhase);
        return true;
    }

    private boolean endBettingPhase(){
        this.startPlayingPhase();
        return true;
    }

    private boolean startPlayingPhase(){
        this.setCurrentPhase(GamePhase.Playing);
        this.startPlayerPlayingPhase();
        return this.gameState.givePlayersCard();
    }

    private boolean startPlayerPlayingPhase(){
        this.schedulePhaseTimeout(GamePhase.Playing,this.BETTING_ROUND_MAX_DURATION, this::endPlayerPlayingPhase);
        return true;
    }
    private boolean endPlayerPlayingPhase(){
        if (this.isPhaseFinished()){
            this.endPlayingPhase();
            this.endPlayingPhase();
        } else{
            this.startPlayerPlayingPhase();
        }
        return true;
    }

    private boolean endPlayingPhase(){
        this.gameState.nextRound();
        if (this.gameState.isGameOver()){
            this.endGame();
        }
        else{
            this.gameState.calculateScores();
            this.startBettingPhase();
        }
        return true;
    }

    private boolean endGame(){
        return true;
    }


    public void schedulePhaseTimeout(GamePhase phase, int seconds, Runnable onTimeOut) {
        this.scheduledTask =  scheduler.schedule(() -> {
            if (this.currentPhase == phase) {
                onTimeOut.run();
            }
        }, seconds, TimeUnit.SECONDS);
    }

    public void cancelTimer(){
        if(this.scheduledTask != null) {
            this.scheduledTask.cancel(false);
        }
    }


    public boolean isPlayingPhasedFinished(){
        if (this.currentPhase.equals(GamePhase.Playing)) {
        }
            return players.size() == cardPlayed.size();
        }
    }
    public boolean isBettingPhaseFinished(){
        if (this.currentPhase.equals(GamePhase.Betting)) {
            return players.size() == bets.size();
        }
    }


    public GamePhase getCurrentPhase() { return this.currentPhase; }
    public void setCurrentPhase(GamePhase phase) { this.currentPhase = phase; }
    public void nextRound() { this.currentRound++; }
    public boolean isGameOver() {return currentRound > 10; }


    public void endPlayingPhase() {
        TrickResult result = this.gameLogic.getTrickResult(this.cardPlayed);

    }
}
