package com.example.skullking.services;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.Room;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class RoomService {


    private List<Room> roomsList;


    RoomService() {
        this.roomsList = new ArrayList<>();
    }

    public Room createRoom(String roomName, String hostName) {

        Room room = new Room();

        room.setName(roomName);
        room.getHost().setName(hostName);

        roomsList.add(room);

        return room;
    }

    public void deleteRoom(UUID uuid) {

        roomsList.removeIf( room -> room.getUuid() == uuid);
    }


    public List<Room> getRoomsList() {
        return roomsList;
    }


    public Player addPlayer(UUID roomUuid, String playerName) {

        Room room = this.roomsList
                .stream()
                .filter(r -> r.getUuid().equals(roomUuid))
                .toList()
                .getFirst();

        Player newPlayer = new Player();
        newPlayer.setName(playerName);


        room.addGuest(newPlayer);

        return newPlayer;
    }


    public boolean isRoomExisting(UUID roomUuid) {

        long roomCount = this.roomsList
                .stream()
                .filter(r -> r.getUuid().equals(roomUuid))
                .count();


        return roomCount != 0;
    }

    public Room getRoom(UUID roomUuid) {

        return this.roomsList
            .stream()
            .filter(r -> r.getUuid().equals(roomUuid))
            .toList()
            .getFirst();
    }

}
