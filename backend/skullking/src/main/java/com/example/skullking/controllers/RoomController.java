package com.example.skullking.controllers;

import com.example.skullking.entities.*;
import com.example.skullking.entities.gameEvents.LobbyEvent;
import com.example.skullking.services.RoomService;

import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private SimpMessagingTemplate template;

    @Operation(summary = "Create a new room and returns the credentials for the host to join")
    @PostMapping
    public ResponseEntity<Room> createRoom(@Valid @RequestBody RoomFormCreate roomFormCreate) {

        String roomName = roomFormCreate.roomName;
        String hostName = roomFormCreate.hostName;

        Room room = this.roomService.createRoom(roomName, hostName);

        return ResponseEntity.status(201).body(room);
    }

    @Operation(summary = "Return all rooms")
    @GetMapping
    public ResponseEntity<List<RoomDTOForGuests>> getAllRooms() {

        List<RoomDTOForGuests> publicRooms = this.roomService
                .getRoomsList()
                .stream()
                .map(RoomDTOForGuests::new)
                .toList();

        return ResponseEntity.status(200).body(publicRooms);
    }

    @Operation(summary = "Join a room and notify all players via WebSocket")
    @PutMapping("/{uuid}/join")
    public ResponseEntity<Player> joinRoom(@PathVariable UUID uuid, @Valid @RequestBody RoomFormJoin roomFormJoin) {

        if(!roomService.isRoomExisting(uuid)){
            return ResponseEntity.badRequest().body(null);
        }

        Player player = roomService.addPlayer(uuid, roomFormJoin.playerName);

        System.out.println("✅ Joueur " + player.getName() + " " + player.getUuid()+ " a rejoint la room " + uuid);

        // ✅ Récupérer la liste COMPLÈTE des joueurs
        List<PlayerDTOForPublic> allPlayers = roomService
                .getRoom(uuid)
                .getPlayers()
                .stream()
                .map(PlayerDTOForPublic::new)
                .toList();

        // ✅ Broadcaster la liste complète à TOUS les joueurs du lobby
        this.template.convertAndSend(
                "/topic/rooms/" + uuid + "/lobby-events",  // ← Avec /topic
                Map.of(
                        "type", "LOBBY_UPDATE",
                        "players", allPlayers,
                        "playerCount", allPlayers.size(),
                        "newPlayer", new PlayerDTOForPublic(player)
                )
        );

        return ResponseEntity.ok(player);
    }

    @Operation(summary = "Leave a room and notify all players via WebSocket")
    @DeleteMapping("/{uuid}/leave")
    public ResponseEntity<Void> leaveRoom(
            @PathVariable UUID uuid,
            @RequestParam String playerUuid
    ) {

        if(!roomService.isRoomExisting(uuid)){
            return ResponseEntity.badRequest().build();
        }

        // Retirer le joueur de la room

        System.out.println("avant : " + roomService.getRoom(uuid).getPlayers().size());
        roomService.removePlayer(uuid, UUID.fromString(playerUuid));
        System.out.println("apres : " + roomService.getRoom(uuid).getPlayers().size());

        System.out.println("👋 Joueur " + playerUuid + " a quitté la room " + uuid);

        // ✅ Récupérer la liste mise à jour
        List<PlayerDTOForPublic> remainingPlayers = roomService
                .getRoom(uuid)
                .getPlayers()
                .stream()
                .map(PlayerDTOForPublic::new)
                .toList();

        // ✅ Broadcaster la nouvelle liste à TOUS
        this.template.convertAndSend(
                "/topic/rooms/" + uuid + "/lobby-events",
                Map.of(
                        "type", "LOBBY_UPDATE",
                        "players", remainingPlayers,
                        "playerCount", remainingPlayers.size(),
                        "leftPlayerUuid", playerUuid
                )
        );

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Return the players connected in the room (initial load only)")
    @GetMapping("/{uuid}/players")
    public ResponseEntity<List<PlayerDTOForPublic>> getPlayers(@PathVariable UUID uuid) {

        if(!roomService.isRoomExisting(uuid)){
            return ResponseEntity.badRequest().body(null);
        }

        List<PlayerDTOForPublic> playersList = this.roomService
                .getRoom(uuid)
                .getPlayers()
                .stream()
                .map(PlayerDTOForPublic::new)
                .toList();

        return ResponseEntity.ok(playersList);
    }
}