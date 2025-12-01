package com.example.skullking.entities.gameEvents;

import java.util.List;

public class BroadcastTurnResultsEvent {

    public static GameEvent type = GameEvent.BROADCAST_TURN_RESULTS;

    public List<Integer> results;
}
