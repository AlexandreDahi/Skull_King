package com.example.skullking.entities.gameEvents;

import java.util.List;

public class BroadcastTurnResultsEvent {

    public static String type = "TURN_RESULTS_EVENT";

    public List<Integer> results;
}
