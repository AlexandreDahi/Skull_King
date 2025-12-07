package com.example.skullking.entities.gameEvents;

import com.example.skullking.entities.PlayerDTOForPublic;

import java.util.List;

public final class BroadcastGameStartEvent {

    public String type;

    public List<PlayerDTOForPublic> playersList;


    public BroadcastGameStartEvent(List<PlayerDTOForPublic> playersList){
        this.type = "GAME_START_EVENT";
        this.playersList = playersList;
    };
}
