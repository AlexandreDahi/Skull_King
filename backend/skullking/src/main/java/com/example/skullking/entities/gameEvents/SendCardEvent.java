package com.example.skullking.entities.gameEvents;

import java.util.UUID;

public class SendCardEvent {

    public static GameEvent type = GameEvent.SEND_CARD;

    public UUID userUuid;
    public String userToken;

    public Integer card;
}
