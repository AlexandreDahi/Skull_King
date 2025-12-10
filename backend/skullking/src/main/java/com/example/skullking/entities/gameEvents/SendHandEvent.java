package com.example.skullking.entities.gameEvents;

import java.util.List;

public class SendHandEvent {

    public List<Integer> hand;
    public String type;

    public SendHandEvent(List<Integer> hand) {
        this.hand = hand;
        this.type = "SEND_HAND_EVENT";
    }
}
