package com.example.skullking.entities.gameEvents;

import java.util.List;

public class BroadcastBetsEvent {

    public String type;
    public List<Integer> betList;


    public BroadcastBetsEvent(List<Integer> betList) {
        this.type = "BETTING_PHASE_END";
        this.betList = betList;
    }
}
