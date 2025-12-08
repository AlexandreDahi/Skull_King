package com.example.skullking.game;

import com.example.skullking.ListPlayerBuilder;
import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.dto.BetPlayer;
import com.example.skullking.entities.game.dto.CardPlayer;
import com.example.skullking.entities.game.cards.CardManager;
import com.example.skullking.services.GameService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.UUID;

@SpringBootTest
public class GameServiceTest {

    @Autowired
    private GameService gameService;


    @Test
    public void shouldStartGame(){
        UUID uuid = UUID.randomUUID();
        List<Player> players = ListPlayerBuilder.build();
        boolean result = this.gameService.startGame(uuid,players);
        Assertions.assertTrue(result);

    }


    @Test
    public void shouldNotAcceptUnknownUser(){
        UUID uuid = UUID.randomUUID();
        List<Player> players = ListPlayerBuilder.build();
        this.gameService.startGame(uuid, players);
        UUID playerUUID = UUID.randomUUID();
        BetPlayer betPlayer = new BetPlayer(playerUUID, 0);
        boolean result = this.gameService.receiveBet(uuid, betPlayer);
        Assertions.assertFalse(result);
    }

    @Test
    public void shouldStartBettingPhase() {
        UUID uuid = UUID.randomUUID();
        List<Player> players = ListPlayerBuilder.build();
        this.gameService.startGame(uuid, players);
        for (Player player : players) {
            UUID playerUUID = player.getUuid();
            BetPlayer betPlayer = new BetPlayer(playerUUID, 0);
            boolean result = this.gameService.receiveBet(uuid, betPlayer);
            Assertions.assertTrue(result);
        }

    }

    @Test
    public void shouldNotBetDuringPlayingPhase(){
        UUID uuid = UUID.randomUUID();
        List<Player> players = ListPlayerBuilder.build();
        this.gameService.startGame(uuid, players);
        for (Player player : players) {
            UUID playerUUID = player.getUuid();
            BetPlayer betPlayer = new BetPlayer(playerUUID, 0);
            boolean result = this.gameService.receiveBet(uuid, betPlayer);
            Assertions.assertTrue(result);
        }
        UUID playerUUID = players.getFirst().getUuid();
        BetPlayer betPlayer = new BetPlayer(playerUUID, 0);
        boolean result = this.gameService.receiveBet(uuid, betPlayer);
        Assertions.assertFalse(result);
    }

    @Test
    public void shouldNotPlayDuringBettingPhase(){
        UUID uuid = UUID.randomUUID();
        List<Player> players = ListPlayerBuilder.build();

        this.gameService.startGame(uuid, players);

    }

    @Test
    public void shouldGameMachineStateRunAFullRound(){
        UUID uuid = UUID.randomUUID();
        List<Player> players = ListPlayerBuilder.build();
        this.gameService.startGame(uuid, players);
        CardManager cardManager = new CardManager();
        for (Player player : players) {
            UUID playerUUID = player.getUuid();
            BetPlayer betPlayer = new BetPlayer(playerUUID, 0);
            boolean result = this.gameService.receiveBet(uuid, betPlayer);
            Assertions.assertTrue(result);
        }
        for (Player player : players) {
            UUID playerUUID = player.getUuid();
            CardPlayer betPlayer = new CardPlayer(0, playerUUID);
            boolean result = this.gameService.receiveCard(uuid, betPlayer);
            Assertions.assertTrue(result);
        }
        UUID playerUUID = players.getFirst().getUuid();
        BetPlayer betPlayer = new BetPlayer(playerUUID, 0);
        boolean result = this.gameService.receiveBet(uuid, betPlayer);
        Assertions.assertFalse(result);
    }


}
