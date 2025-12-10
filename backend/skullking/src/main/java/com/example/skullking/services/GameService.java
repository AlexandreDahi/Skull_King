package com.example.skullking.services;


import com.example.skullking.entities.Player;
import com.example.skullking.entities.PlayerDTOForPublic;
import com.example.skullking.entities.Room;
import com.example.skullking.entities.game.cards.Hand;
import com.example.skullking.entities.game.dto.BetPlayer;
import com.example.skullking.entities.game.dto.CardPlayer;

import com.example.skullking.entities.game.GamePhase;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;


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
            this.endBettingPhase(room);
        }

    }

    public void receiveCard(Room room, CardPlayer cardPlayer){
        if (room.getGameState().getCurrentPhase() != GamePhase.Playing) {
            return;
        }
        try {
            room.getGameState().recordCardPlayed(cardPlayer);
            room.getGameState().cancelScheduledTask();
            UUID currentPlayer = room.getGameState().getCurrentPlayer().getUuid();
            wsService.broadcastCard(room,currentPlayer, cardPlayer.getCardId());
            this.endPlayerPlayingPhase(room);
        }
        catch (Exception e){
            e.printStackTrace();
        }

    }

    public void startBettingPhase(Room room){
        // Set state
        room.getGameState().setCurrentPhase(GamePhase.Betting);

        // Broadcast
        Instant deadline = Instant.now().plusSeconds(30);
        wsService.broadcastBettingPhaseStart(room, deadline);
        Map<Player, Hand> hands = room.getGameState().givePlayersCard();
        for(Map.Entry<Player,Hand> hand : hands.entrySet()){
            List<Integer> cards = new ArrayList<>(hand.getValue().getCards().keySet());
            wsService.sendHandToPlayer(room, hand.getKey(),cards);
        }

        // Schedule next phase
        this.scheduler.schedule(
                () -> this.endBettingPhase(room),
                deadline
        );

    }

    private void endBettingPhase(Room room){
        List<BetPlayer> betList = room.getGameState().getBetList();
        wsService.broadcastBettingPhaseEnd(room,betList);
        this.startPlayingPhase(room);
    }

    private void startPlayingPhase(Room room){
        // Set state
        room.getGameState().setCurrentPhase(GamePhase.Playing);

        // Schedule next phase
        this.startPlayerPlayingPhase(room);

    }

    private void startPlayerPlayingPhase(Room room){
        // Broadcast
        Instant deadline = Instant.now().plusSeconds(30);
        room.getGameState().setNextPlayer();
        UUID playerId = room.getGameState().getCurrentPlayer().getUuid();

        // Schedule next phase
        this.scheduler.schedule(
                () -> this.endPlayerPlayingPhase(room),
                deadline
        );

    }
    private void endPlayerPlayingPhase(Room room){
        if (room.getGameState().hasEveryonePlayedACard()){
            this.endTrick(room);
        }
        else{
            startPlayerPlayingPhase(room);
        }
    }

    private void startTrick(Room room){
        this.startPlayerPlayingPhase(room);
    }

    private void endTrick(Room room){
        room.getGameState().endOfTrick();
        if (room.getGameState().haveEveryCardsBeenPlayed()){
            this.endPlayingPhase(room);
        }
        else{
            this.startTrick(room);
        }
    }

    private void endPlayingPhase(Room room){
        room.getGameState().endOfRound();
        if (room.getGameState().isGameOver()){
            this.endGame();
            return;
        }
        else{
            this.startBettingPhase(room);
        }
    }

    private boolean endGame(){
        return true;
    }
}
