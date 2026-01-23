package com.example.skullking.entities.gameEvents;

import java.util.UUID;

public class BroadcastPlayerWhoShouldPlayEvent {
    public String type;
    public UUID playerWhoShouldPlay;

    public BroadcastPlayerWhoShouldPlayEvent(UUID playerWhoShouldPlay){
        this.type = "PLAYER_TURN";
        this.playerWhoShouldPlay = playerWhoShouldPlay;
    }
}
