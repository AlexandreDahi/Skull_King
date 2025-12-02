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
import java.util.UUID;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/rooms")
public class RoomController {


    @Autowired RoomService roomService;

    //private SimpMessagingTemplate template;

    @Autowired SimpMessagingTemplate template;
    /*public RoomController(SimpMessagingTemplate template) {
        this.template = template;
    }*/


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

    @Operation(summary = "Return an id and a token to join a game through the websocket")
    @PutMapping("/{uuid}/join")
    public ResponseEntity<Player> joinRoom(@PathVariable UUID uuid, @Valid @RequestBody RoomFormJoin roomFormJoin) {


        if(!roomService.isRoomExisting(uuid)){
            return ResponseEntity.badRequest().body(null);
        }

        Player player = roomService.addPlayer(uuid, roomFormJoin.playerName);


        System.out.println("websocket service : " +  this.template);

        this.template.convertAndSend(
                "/rooms/" + uuid + "/lobby-events",
                new LobbyEvent(
                    "NEW_PLAYER_EVENT",
                    new PlayerDTOForPublic(player),
                    roomService.getRoom(uuid).countPlayers()
                )
        );


        return ResponseEntity.ok(player);

    }

    @Operation(summary = "Return the players connected in the room")
    @GetMapping("/{uuid}/players")
    public ResponseEntity<List<PlayerDTOForPublic>> getPlayers(@PathVariable UUID uuid) {

        List<PlayerDTOForPublic> playersList =  this.roomService
            .getRoom(uuid)
            .getPlayers()
            .stream()
            .map(PlayerDTOForPublic::new)
            .toList();

        return ResponseEntity.ok(playersList);

    }


}
