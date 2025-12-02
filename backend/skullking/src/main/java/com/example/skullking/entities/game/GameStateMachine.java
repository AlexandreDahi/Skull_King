package com.example.skullking.entities.game;

import com.example.skullking.entities.Player;

import java.util.List;
import java.util.concurrent.ScheduledExecutorService;

public class GameStateMachine {
    private ScheduledExecutorService scheduler;
    private int BETTING_ROUND_MAX_DURATION = 60;

    GameState gameState = new GameState();


    public void startGame(List<Player> players){
        startBettingPhase();
    }

    public boolean receiveBetPlayer(BetPlayer betPlayer) {
        if (gameState.getCurrentPhase() != GamePhase.Betting) {
            throw new IllegalStateException("Not in betting phase!");
        }
        gameState.recordBet(betPlayer.getPlayerId(), betPlayer.getBetAmount());
        if ( gameState.isPhaseFinished()){
            this.endBettingPhase();
        }
        broadcastGameState(" placed a bet of " + betPlayer);
        return true;
    }

    public boolean receiveCardPlayer(CardPlayer cardPlayer) {
        if (gameState.getCurrentPhase() != GamePhase.Playing) {
            throw new IllegalStateException("Not in playing phase!");
        }
        gameState.recordCardPlayed(cardPlayer.getPlayerId(), cardPlayer.getCardId());

        if( gameState.isPhaseFinished()){
            this.endPlayingPhase();
        }
        broadcastGameState(" placed a bet of " + GamePhase);
        return true;
    }


    private void givePlayersCard(){}

    private boolean startBettingPhase(){
        //Broadcast that i need bets
        this.gameState.schedulePhaseTimeout(GamePhase.Betting,this.BETTING_ROUND_MAX_DURATION, this::endBettingPhase);
        return true;
    }

    private boolean endBettingPhase(){
        this.startPlayingPhase();
        return true;
    }

    private boolean startPlayingPhase(){

    }

    private boolean startPlayerPlayingPhase(){
        this.gameState.schedulePhaseTimeout(GamePhase.Playing,this.BETTING_ROUND_MAX_DURATION, this::endPlayerPlayingPhase);
        return true;
    }
    private boolean endPlayerPlayingPhase(){
        if (this.gameState.isPhaseFinished()){
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
            this.startBettingPhase();
        }
        return true;
    }

    private boolean endGame(){

    }
}
