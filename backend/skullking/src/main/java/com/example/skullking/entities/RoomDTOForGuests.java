package com.example.skullking.entities;


import java.util.UUID;

public class RoomDTOForGuests {


    public UUID uuid;
    public String name;
    public int nbPlayers;
    public String hostName;



    public RoomDTOForGuests(Room room) {

        this.uuid = room.getUuid();
        this.name = room.getName();
        this.nbPlayers = room.countPlayers();
        this.hostName = room.getHost().getName();
    }

}
