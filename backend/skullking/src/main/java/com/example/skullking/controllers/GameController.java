package com.example.skullking.controllers;


import com.example.skullking.entities.PlayerDTOForPublic;
import com.example.skullking.entities.gameEvents.BaseEvent;
import com.example.skullking.entities.gameEvents.JoinGameEvent;
import com.example.skullking.entities.gameEvents.SendBetEvent;
import com.example.skullking.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;




class Message {

    public String type;
    public Object data;


    public Message(String type) {
        this.type = type;
    }
}

@Controller
public class GameController {


    private SimpMessagingTemplate template;

    @Autowired
    public GameController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @Autowired
    private RoomService roomService;

    @MessageMapping("/rooms/{roomUuid}/lobby")
    public void handleLobbyMessage(
            @DestinationVariable UUID roomUuid,
            @Payload Map<String, Object> message
    ) {
        String messageType = (String) message.get("type");

        System.out.println("📨 Message reçu: " + messageType);

        if ("START_GAME".equals(messageType)) {
            if (!roomService.isRoomExisting(roomUuid)) {
                System.err.println("❌ Room inexistante");
                return;
            }

            int playerCount = roomService.getRoom(roomUuid).countPlayers();
            if (playerCount < 2) {
                System.err.println("❌ Pas assez de joueurs");
                return;
            }

            System.out.println("🚀 Lancement de la partie");

            // ✅ Utiliser /topic au lieu de /rooms
            this.template.convertAndSend(
                    "/topic/rooms/" + roomUuid + "/lobby-events",  // ← Ajouter /topic
                    Map.of(
                            "type", "GAME_STARTED",
                            "roomUuid", roomUuid.toString(),
                            "playerCount", playerCount
                    )
            );
        }
    }

    @MessageMapping("/rooms/{roomUuid}/users/{userUuid}/get-players")
    //@SendTo("/topic/messages")
    public void getPlayers(
            @DestinationVariable UUID roomUuid,
            @DestinationVariable String userUuid,
            @Payload JoinGameEvent joinGameEvent
    ) {

        // check room existence
        // Check user identity


        List<PlayerDTOForPublic> playerList =  roomService
                .getRoom(roomUuid)
                .getPlayers()
                .stream()
                .map(PlayerDTOForPublic::new)
                .toList();

        this.template.convertAndSend(
            "/rooms/" + roomUuid + "/lobby-events",
            new Message("roome : " + roomUuid + ", user : " + userUuid)
        );
        //return new Message("room : " + roomUuid + ", user : " + userUuid);
    }
}

