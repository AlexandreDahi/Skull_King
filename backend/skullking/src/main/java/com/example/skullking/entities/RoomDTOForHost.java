package com.example.skullking.entities;

import java.util.UUID;

public class RoomDTOForHost {

    public UUID uuid;
    public String name;
    public UUID hostUuid;
    public String hostToken;

    public RoomDTOForHost(Room room) {

        this.uuid = room.getUuid();
        this.name = room.getName();
        this.hostUuid = room.getHost().getUuid();
        this.hostToken = room.getHost().getToken();
    }
}
