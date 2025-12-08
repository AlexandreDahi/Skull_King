package com.example.skullking.entities.game.cards;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;


public class DeckBuilder {

    public Map<Integer, Card> build() {
        ObjectMapper mapper = new ObjectMapper();

        try (InputStream inputStream = getClass().getClassLoader()
                .getResourceAsStream("index_carte.json")) {
            if (inputStream == null) {
                throw new RuntimeException("Fichier index_cartes.json non trouvé !");
            }
            JsonNode root = mapper.readTree(inputStream);
            JsonNode cards =root.get("index_carte");
            Map<Integer, Card> deck = new HashMap<>();
            if (cards.isArray()) {
                for (JsonNode cardNode : cards) {
                    String name = cardNode.get("name").asText();
                    String image = cardNode.get("image").asText();
                    int id = cardNode.get("id").asInt();
                    JsonNode typeNode = cardNode.get("type");
                    List<CardType> types = StreamSupport.stream(typeNode.spliterator(), false)
                            .map(node -> CardType.valueOf(node.asText()))
                            .toList();
                    String suite = cardNode.get("suite").asText();
                    String description = cardNode.get("description").asText();
                    deck.put(id,new Card(id,types,CardSuite.valueOf(suite)));
                }
            }
            return deck;
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
