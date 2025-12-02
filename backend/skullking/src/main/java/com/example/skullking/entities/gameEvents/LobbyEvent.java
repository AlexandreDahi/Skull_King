package com.example.skullking.entities.gameEvents;

import com.example.skullking.entities.PlayerDTOForPublic;

public class LobbyEvent {

    public String type;
    public PlayerDTOForPublic player;
    public Integer nbOfPlayers;


    public LobbyEvent(String type, PlayerDTOForPublic player, Integer nbOfPlayers) {

        this.type = type;
        this.player = player;
        this.nbOfPlayers = nbOfPlayers;

    }
}
