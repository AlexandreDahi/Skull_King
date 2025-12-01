package com.example.skullking.entities.gameEvents;

import java.util.UUID;

public class SendBetEvent extends BaseEvent {

    public static GameEvent type = GameEvent.SEND_BET;

    public String userUuid;
    public String userToken;

    public Integer bet;
}
