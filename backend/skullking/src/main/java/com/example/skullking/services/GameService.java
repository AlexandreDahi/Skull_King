package com.example.skullking.services;


import com.example.skullking.entities.Player;
import com.example.skullking.entities.PlayerDTOForPublic;
import com.example.skullking.entities.Room;
import com.example.skullking.entities.game.dto.BetPlayer;
import com.example.skullking.entities.game.dto.CardPlayer;

import com.example.skullking.entities.game.GamePhase;
import com.example.skullking.entities.gameEvents.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;


@Service
public class GameService {

    private int BETTING_ROUND_MAX_DURATION = 60;

    @Autowired
    private WebSocketService wsService;

    @Autowired
    private TaskScheduler scheduler;

    public void startGame(Room room){

        room.getGameState().startGame(room.getPlayers());


        List<PlayerDTOForPublic> playersList = room.getPlayers()
                .stream()
                .map(PlayerDTOForPublic::new)
                .toList();


        wsService.broadcastGameStart(room, playersList);

        this.startBettingPhase(room);

    }

    public void receiveBet(Room room, BetPlayer betPlayer){

        if (room.getGameState().getCurrentPhase() != GamePhase.Betting) {
            return;
        }

        // check if player hasn't bet yet

        room.getGameState().recordBet(betPlayer.getPlayerId(), betPlayer.getBetAmount());

        if (room.getGameState().hasEveryoneBet()) {
            room.getGameState().cancelScheduledTask();
            this.startPlayingPhase(room);
        }

    }

    public void receiveCard(Room room, CardPlayer cardPlayer){

        if (room.getGameState().getCurrentPhase() != GamePhase.Playing) {
            return;
        }

        // check if its the player's turn
        // room.getGameState().getCurrentPlayer()


        // check if the card est légale


        // gameState.setCardForCurrentPlayer(card)


        this.endPlayingPhase();

        return room.getGameStateMachine().receiveCardPlayer(cardPlayer);
    }

    public void startBettingPhase(Room room){

        // Set state
        room.getGameState().setCurrentPhase(GamePhase.Betting);

        // Broadcast
        Instant deadline = Instant.now().plusSeconds(30);
        wsService.broadcastBettingPhaseStart(room, deadline);

        // Schedule next phase
        this.scheduler.schedule(
                () -> this.endBettingPhase(room),
                deadline
        );

    }

    private void endBettingPhase(Room room){
        this.startPlayingPhase(room);
    }

    private void startPlayingPhase(Room room){

        // Set state
        room.getGameState().setCurrentPhase(GamePhase.Playing);

        // Broadcast
        wsService.broadcastBettingPhaseEnd(room, );


        // Schedule next phase
        this.startPlayerPlayingPhase(room);

    }

    private void startPlayerPlayingPhase(Room room){

        // Set state
        room.getGameState().schedulePhaseTimeout(GamePhase.Playing,this.BETTING_ROUND_MAX_DURATION, this::endPlayerPlayingPhase);

        // Broadcast
        Instant deadline = Instant.now().plusSeconds(30);

        // Player p = gameState.getCurrentPlayer()

        // Schedule next phase
        this.scheduler.schedule(
                () -> this.endPlayerPlayingPhase(room),
                deadline
        );

    }
    private void endPlayerPlayingPhase(Room room){

        if (room.getGameState().isRoundFinished()){
            this.endRound();
            return;
        }

        this.startPlayerPlayingPhase(room);

    }
    private void startRound(){

    }
    private void endRound(){
        if (isPlayingPhaseFinished()){
            this.endPlayingPhase();
            return;
        }


        // annoncer le gagnant du pli et celui qui commence
        // nextRound...


    }
    private void endPlayingPhase(){

        if (this.gameState.isGameOver()){
            this.endGame();
            return;
        }

        //this.gameState.nextPlayingPhase();
        //this.startBettingPhase();


    }

    private boolean endGame(){
        return true;
    }
}
