package com.example.skullking.entities.game.dto;

import java.util.UUID;

public class CardPlayer {
    private int cardId;
    private UUID playerId;

    public CardPlayer(int cardId, UUID playerId) {
        this.cardId = cardId;
        this.playerId = playerId;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public void setPlayerId(UUID playerId) {
        this.playerId = playerId;
    }

    public int getCardId() {
        return cardId;
    }

    public void setCardId(int cardId) {
        this.cardId = cardId;
    }
}
