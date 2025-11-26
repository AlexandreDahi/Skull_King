package com.example.skullking.entities;

import java.util.UUID;

public class Player {

    private UUID uuid;

    Player() {
        this.uuid = UUID.randomUUID();
    }

    public UUID getUuid() {
        return uuid;
    }

}
