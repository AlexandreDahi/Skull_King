package com.example.skullking.entities.gameEvents;

import java.time.Instant;
import java.util.Date;

public class BroadcastBettingPhaseStartEvent {

    public String type;
    public Instant endAt;

    public BroadcastBettingPhaseStartEvent(Instant endAt) {
        this.type = "BETTING_PHASE_START";
        this.endAt = endAt;
    }
}
