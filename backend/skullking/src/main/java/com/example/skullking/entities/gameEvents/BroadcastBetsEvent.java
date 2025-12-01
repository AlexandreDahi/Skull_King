package com.example.skullking.entities.gameEvents;

import java.util.List;

public class BroadcastBetsEvent {

    public static GameEvent type = GameEvent.BROADCAST_BETS;

    public List<List<Integer>> betList;
}
