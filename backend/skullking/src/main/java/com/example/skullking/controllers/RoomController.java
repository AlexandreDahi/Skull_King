package com.example.skullking.controllers;

import com.example.skullking.entities.Room;
import com.example.skullking.entities.RoomCreationForm;
import com.example.skullking.entities.RoomDTOForGuests;
import com.example.skullking.services.RoomService;

import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController {


    @Autowired RoomService roomService;

    @Operation(summary = "Create a new room")
    @PostMapping
    public ResponseEntity<Room> createRoom(@Valid @RequestBody RoomCreationForm roomCreationForm) {

        System.out.println("name : " + roomCreationForm.name);
        String roomName = roomCreationForm.name;
        Room room = this.roomService.createRoom(roomName);

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


}
