package com.example.skullking.entities;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

public class Player {

    private UUID uuid;
    private String token;

    private String name;


    private List<Integer> roundResultsList;
    private List<Integer> formerGamesResults;


    private static String generateRandomToken() {

        final int NB_OF_BYTES = 32;

        SecureRandom secureRandom = new SecureRandom();

        byte[] randomBytes = new byte[NB_OF_BYTES];
        secureRandom.nextBytes(randomBytes);

        return Base64.getEncoder().encodeToString(randomBytes);
    }

    public Player() {
        this.name = "";
        this.uuid = UUID.randomUUID();
        this.token = generateRandomToken();
        this.roundResultsList = new ArrayList<>();
        this.formerGamesResults = new ArrayList<>();
    }

    public UUID getUuid() {
        return uuid;
    }

    public String getToken(){
        return this.token;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Integer> getRoundResultsList() {
        return roundResultsList;
    }

    public List<Integer> getFormerGamesResults() {
        return formerGamesResults;
    }
}
