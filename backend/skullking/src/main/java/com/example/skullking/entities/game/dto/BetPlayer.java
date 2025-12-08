package com.example.skullking.entities.game.dto;

import java.util.UUID;

public class BetPlayer {
    private UUID playerId;
    private int betAmount;

    public BetPlayer(UUID playerId, int betAmount) {
        this.playerId = playerId;
        this.betAmount = betAmount;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public void setPlayerId(UUID playerId) {
        this.playerId = playerId;
    }

    public int getBetAmount() {
        return betAmount;
    }

    public void setBetAmount(int betAmount) {
        this.betAmount = betAmount;
    }
}
