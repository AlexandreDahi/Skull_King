package com.example.skullking.game;

import com.example.skullking.ListPlayerBuilder;
import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.cards.Card;
import com.example.skullking.entities.game.cards.CardManager;
import com.example.skullking.entities.game.cards.Hand;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.*;

public class CardManagerTest {



    @Test
    public void handsShouldBeValid(){
        List<Player> players = ListPlayerBuilder.build();
        CardManager cardManager = new CardManager();

        Map<Integer, Card> cards = new HashMap<>();
        for (Player player : players){
            UUID uuid = UUID.randomUUID();
            cardManager.drawHand(uuid,10);
            Hand hand = cardManager.getPlayerHand(uuid);
            Assertions.assertNotNull(hand);
            int handSize =  hand.getCards().size();
            Assertions.assertEquals(10, handSize);
            cards.putAll(hand.getCards());
        }
        Assertions.assertEquals(40,cards.size());
    }
}
