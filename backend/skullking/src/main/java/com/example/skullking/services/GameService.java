package com.example.skullking.services;


import com.example.skullking.entities.Player;
import com.example.skullking.entities.PlayerDTOForPublic;
import com.example.skullking.entities.Room;
import com.example.skullking.entities.game.BetPlayer;
import com.example.skullking.entities.game.CardPlayer;

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

    @Autowired
    private WebSocketService wsService;

    @Autowired
    private TaskScheduler scheduler;

    public boolean startGame(Room room){

        boolean result =  room.getGameStateMachine().startGame(room.getPlayers());


        List<PlayerDTOForPublic> playersList = room.getPlayers()
                .stream()
                .map(PlayerDTOForPublic::new)
                .toList();


        wsService.broadcastGameStart(room, playersList);

        this.startBettingPhase(room);

        return result;
    }

    public void startBettingPhase(Room room) {

        room.getGameStateMachine();

        Instant deadline = Instant.now().plusSeconds(30);

        this.scheduler.schedule(
                () -> wsService.broadcastBettingPhaseStart(room, deadline),
                Instant.now().plusSeconds(5));

    }

    public boolean receiveBet(Room room, BetPlayer betPlayer){

        return room.getGameStateMachine().receiveBetPlayer(betPlayer);
    }

    public boolean receiveCard(Room room, CardPlayer cardPlayer){

        return room.getGameStateMachine().receiveCardPlayer(cardPlayer);
    }
}
