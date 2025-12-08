package com.example.skullking.entities.game.score;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.cards.Card;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class ScoreManager {
    private final Map<Player, Integer> bets = new HashMap<>();
    private final LinkedHashMap<Player, Card> cardPlayed = new LinkedHashMap<>();
    private final Map<Player,Integer> roundWon = new HashMap<>();
    private final Map<Player,Integer> points = new HashMap<>();
}
