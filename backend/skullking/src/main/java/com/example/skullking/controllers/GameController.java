package com.example.skullking.controllers;


import com.example.skullking.entities.Room;
import com.example.skullking.entities.game.BetPlayer;
import com.example.skullking.entities.game.CardPlayer;
import com.example.skullking.entities.gameEvents.PlayerBetEvent;
import com.example.skullking.entities.gameEvents.PlayerSentCardEvent;
import com.example.skullking.entities.gameEvents.HostStartedGameEvent;
import com.example.skullking.services.GameService;
import com.example.skullking.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.UUID;



@Controller
public class GameController {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private RoomService roomService;

    @Autowired
    private GameService gameService;



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

    @MessageMapping("/rooms/{roomUuid}/start-game")
    public void startGame(
        @DestinationVariable UUID roomUuid,
        @Payload HostStartedGameEvent startGameEvent
    ) {

        if (!roomService.isRoomExisting(roomUuid)) {
            System.err.println("[startGame] Room with uuid " + roomUuid +" doesn't exist");
            return;
        }

        Room room = this.roomService.getRoom(roomUuid);

        int playerCount = roomService.getRoom(roomUuid).countPlayers();
        if (playerCount < 2) {
            System.err.println("[startGame] No enough players");
            return;
        }

        if (!room.getHost().getToken().equals(startGameEvent.userToken)) {
            System.err.println(
                "[startGame] Someone tried to start the game but provided a wrong host token");
            System.err.println("host token : " + room.getHost().getToken() + ", token received : " + startGameEvent.userToken);
            return;
        }

        gameService.startGame(room);


    }

    @MessageMapping("/rooms/{roomUuid}/bet")
    public void bet(
            @DestinationVariable UUID roomUuid,
            @Payload PlayerBetEvent playerBetEvent
    ) {

        // TODO: check user identity & room existence

        Room room = roomService.getRoom(roomUuid);

        BetPlayer betPlayer = new BetPlayer();
        betPlayer.setBetAmount(playerBetEvent.bet);
        betPlayer.setPlayerId(playerBetEvent.userUuid);

        gameService.receiveBet(room, betPlayer);
    }


    @MessageMapping("/rooms/{roomUuid}/play-card")
    public void playCard(
            @DestinationVariable UUID roomUuid,
            @Payload PlayerSentCardEvent playerSentCardEvent
    ) {

        // TODO: check user identity & room existence

        Room room = roomService.getRoom(roomUuid);
        CardPlayer cardPlayer = new CardPlayer();
        cardPlayer.setPlayerId(playerSentCardEvent.userUuid);
        cardPlayer.setCardId(playerSentCardEvent.card);


        gameService.receiveCard(room, cardPlayer);

    }

}

