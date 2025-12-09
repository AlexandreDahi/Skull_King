package com.example.skullking.entities.gameEvents;

import com.example.skullking.entities.game.dto.BetPlayer;

import java.util.List;

public class BroadcastBetsEvent {

    public String type;
    public List<BetPlayer> betList;


    public BroadcastBetsEvent(List<BetPlayer> betList) {
        this.type = "BETTING_PHASE_END";
        this.betList = betList;
    }
}
