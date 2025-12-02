package com.example.skullking.entities;

import java.util.UUID;

public class PlayerDTOForPublic {

    public UUID uuid;
    public String name;

    public PlayerDTOForPublic(Player player) {

        this.uuid = player.getUuid();
        this.name = player.getName();
    }
}
