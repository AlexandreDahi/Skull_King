package com.example.skullking.services;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.BetPlayer;
import com.example.skullking.entities.game.CardPlayer;
import com.example.skullking.entities.game.GameState;
import com.example.skullking.entities.game.GameStateMachine;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class GameService {

    private Map<UUID, GameStateMachine> gameStateMap = new HashMap<> ();

    public boolean startGame(UUID roomUuid, List<Player> players){
        if (this.gameStateMap.containsKey(roomUuid)){
            return this.gameStateMap.get(roomUuid).startGame(players);
        }
        return false;
    }

    public boolean receiveBet(UUID roomUuid, BetPlayer betPlayer){
        if (this.gameStateMap.containsKey(roomUuid)){
            return this.gameStateMap.get(roomUuid).receiveBetPlayer(betPlayer);
        }
        return false;
    }

    public boolean receiveCard(UUID roomUuid, CardPlayer cardPlayer){
        if (this.gameStateMap.containsKey(roomUuid)){
            return this.gameStateMap.get(roomUuid).receiveCardPlayer(cardPlayer);
        }
        return false;
    }


}
