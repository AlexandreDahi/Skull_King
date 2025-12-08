package com.example.skullking.entities.game;

import com.example.skullking.entities.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.concurrent.ScheduledExecutorService;

public class GameStateMachine {
    private ScheduledExecutorService scheduler;


    GameState gameState;
    private SimpMessagingTemplate webSocket;


    public GameStateMachine() {

        this.gameState = new GameState();
    }




    public boolean startGame(List<Player> players){
        startBettingPhase();
        return this.gameState.startGame(players);
    }

    public boolean receiveBetPlayer(BetPlayer betPlayer) {
        if (gameState.getCurrentPhase() != GamePhase.Betting) {
            throw new IllegalStateException("Not in betting phase!");
        }
        gameState.recordBet(betPlayer.getPlayerId(), betPlayer.getBetAmount());
        if ( gameState.isPhaseFinished()){
            this.endBettingPhase();
            this.gameState.cancelTimer();
        }
        //broadcastGameState(" placed a bet of " + betPlayer);
        return true;
    }

    public boolean receiveCardPlayer(CardPlayer cardPlayer) {
        if (gameState.getCurrentPhase() != GamePhase.Playing) {
            throw new IllegalStateException("Not in playing phase!");
        }
        gameState.recordCardPlayed(cardPlayer.getPlayerId(), cardPlayer.getCardId());

        if( gameState.isPhaseFinished()){
            this.endPlayingPhase();
            this.gameState.cancelTimer();
        }
        //broadcastGameState(" placed a bet of " + GamePhase);
        return true;
    }


    private void givePlayersCard(){}


}
