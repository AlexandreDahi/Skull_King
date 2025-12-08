package com.example.skullking;

import com.example.skullking.entities.Player;

import java.util.ArrayList;
import java.util.List;

public class ListPlayerBuilder {
    public static List<Player> build(){
        List<Player> players = new ArrayList<>();
        Player player1 = new Player("player1");
        Player player2 = new Player("player2");
        Player player3 = new Player("player3");
        Player player4 = new Player("player4");
        players.add(player1);
        players.add(player2);
        players.add(player3);
        players.add(player4);
        return players;
    }
}
