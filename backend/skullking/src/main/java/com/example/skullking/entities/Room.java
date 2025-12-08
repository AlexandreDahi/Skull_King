package com.example.skullking.entities;

import com.example.skullking.entities.game.GameState;
import com.example.skullking.entities.game.GameStateMachine;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Room {

    private UUID uuid;
    private String name;

    private Player host;
    private List<Player> guestsList;


    private GameState gameState;


    public Room() {
        this.uuid = UUID.randomUUID();
        this.host = new Player();
        this.guestsList = new ArrayList<>();
        this.name = "";
        this.gameState = new GameState();
    }

    public UUID getUuid() {
        return this.uuid;
    }

    public void addGuest(Player player) {

        if (!this.guestsList.contains(player)) {

            this.guestsList.add(player);
        }
    }

    public void deleteGuest(UUID playerUuid) {

        this.guestsList.removeIf(p -> p.getUuid().equals(playerUuid));
    }

    public int countPlayers() {

        // the host + the guests
        return 1 + this.guestsList.size();
    }

    public void setHost(Player host) {
        this.host = host;
    }

    public Player getHost() {
        return this.host;
    }

    public List<Player> getPlayers() {

        ArrayList<Player> copiedList = new ArrayList<>(this.guestsList);
        copiedList.add(this.host);

        return copiedList;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }


    public GameState getGameState() {
        return this.gameState;
    }
}
