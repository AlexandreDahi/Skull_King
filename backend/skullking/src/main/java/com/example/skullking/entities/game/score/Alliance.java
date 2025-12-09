package com.example.skullking.entities.game.score;

import com.example.skullking.entities.Player;

public class Alliance {
    Player player1;
    Player player2;

    public Alliance(Player player1,Player player2){
        this.player1 = player1;
        this.player2 = player2;
    }

    public boolean playerInAlliance(Player player) {
        return player.equals(player1) || player.equals(player2);
    }
}
