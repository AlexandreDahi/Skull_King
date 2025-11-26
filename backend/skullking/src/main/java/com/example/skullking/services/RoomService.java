package com.example.skullking.services;

import com.example.skullking.entities.Room;
import com.example.skullking.entities.RoomCreationForm;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
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

    public Room createRoom(String name) {

        Room room = new Room();

        room.setName(name);

        roomsList.add(room);

        return room;
    }

    public void deleteRoom(UUID uuid) {

        roomsList.removeIf( room -> room.getUuid() == uuid);
    }


    public List<Room> getRoomsList() {
        return roomsList;
    }

}
