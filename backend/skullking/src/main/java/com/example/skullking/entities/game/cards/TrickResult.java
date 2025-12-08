package com.example.skullking.entities.game.cards;

import com.example.skullking.entities.Player;

public class TrickResult {
    int goldAmount;
    Player player;

    public TrickResult(int goldAmount, Player player) {
        this.goldAmount = goldAmount;
        this.player = player;
    }

    public int getGoldAmount() {
        return goldAmount;
    }

    public Player getPlayer() {
        return player;
    }
}
