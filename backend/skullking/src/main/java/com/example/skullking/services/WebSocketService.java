package com.example.skullking.services;


import com.example.skullking.entities.Player;
import com.example.skullking.entities.PlayerDTOForPublic;
import com.example.skullking.entities.Room;
import com.example.skullking.entities.game.BetPlayer;
import com.example.skullking.entities.gameEvents.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate webSocket;


    private String getRoomRoute(UUID roomUuid) {
        return "/topic/rooms/" + roomUuid;
    }

    private String getGeneralChannel(UUID roomUuid) {
        return this.getRoomRoute(roomUuid) + "/general";
    }

    private String getPrivateChannel(UUID roomUuid, Player player) {

        String playerChannel = "/" + player.getUuid() + "/" + player.getToken();

        return this.getRoomRoute(roomUuid) + playerChannel;
    }

    private String getLobbyChannel(UUID roomUuid) {
        return this.getRoomRoute(roomUuid) + "/lobby-events";
    }

    public void broadcastGameStart(Room room, List<PlayerDTOForPublic> playersList) {
        webSocket.convertAndSend(
                this.getLobbyChannel(room.getUuid()),
                new BroadcastGameStartEvent(playersList)
        );
    }

    public void sendHandToPlayer(Room room, Player player, List<Integer> hand) {

        String path = this.getPrivateChannel(room.getUuid(), player) + "/hand";

        webSocket.convertAndSend(path, new SendHandEvent(hand));
    }

    public void broadcastBettingPhaseStart(Room room, Instant endAt) {
        webSocket.convertAndSend(
                this.getGeneralChannel(room.getUuid()),
                new BroadcastBettingPhaseStartEvent(endAt)
        );
    }

    public void broadcastBettingPhaseEnd(Room room, List<BetPlayer> betsList) {

        webSocket.convertAndSend(
                this.getGeneralChannel(room.getUuid()),
                new BroadcastBetsEvent(betsList)
        );
    }

    public void broadcastCard(
            Room room,
            Player currentPlayer,
            Date eventEnd,
            Integer lastCardPlayed
    ) {
        webSocket.convertAndSend(
                this.getGeneralChannel(room.getUuid()),
                new BroadcastCardEvent(currentPlayer.getUuid(), eventEnd, lastCardPlayed)
        );
    }

}
