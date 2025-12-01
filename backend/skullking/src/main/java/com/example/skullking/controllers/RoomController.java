package com.example.skullking.controllers;

import com.example.skullking.entities.*;
import com.example.skullking.services.RoomService;

import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/rooms")
public class RoomController {


    @Autowired RoomService roomService;

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


        return ResponseEntity.ok(player);

    }


}
