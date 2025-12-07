package com.example.skullking.entities.gameEvents;

import java.util.Date;
import java.util.UUID;

public class BroadcastCardEvent {

    public String type;

    public UUID currentPlayerUuid;
    public Date eventEnd;
    public Integer cardPlayedByLastPlayer;

    public BroadcastCardEvent(
            UUID currentPlayerUuid,
            Date eventEnd,
            Integer cardPlayedByLastPlayer
    ) {
        this.type = "CARD_EVENT";
        this.currentPlayerUuid = currentPlayerUuid;
        this.eventEnd = eventEnd;
        this.cardPlayedByLastPlayer = cardPlayedByLastPlayer;
    }

}
