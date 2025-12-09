package com.example.skullking.entities.game.score;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.cards.Card;
import com.example.skullking.entities.game.dto.BetPlayer;

import java.util.*;

public class ScoreManager {
    private final Map<Player, Integer> bets = new HashMap<>();
    private final Map<Player,Integer> tricksWon = new HashMap<>();
    private final Map<Player,Integer> points = new HashMap<>();
    private final List<Alliance> alliances = new ArrayList<>();
    int tricksNumber = 1;

    public void setBet(int bet,Player player){
        this.bets.put(player,bet);
    }
    public void increaseScore(int scoreIncrease, Player player){
        int oldScore = this.points.get(player);
        this.points.put(player,oldScore + scoreIncrease);
    }
    public void initializeScores(List<Player> players){
        int START_OF_GAME_SCORE = 0;
        for (Player  player : players){
            this.points.put(player,START_OF_GAME_SCORE);
        }
    }
    public Map<Player,Integer> calculateScoresEndOfPlayingPhase() {
        for (Map.Entry<Player,Integer> entry : bets.entrySet()){
            Player player = entry.getKey();
            int totalPoints = this.points.get(player);
            int allianceNumber = this.calculateAllianceIncrease(player);
            int endOfRoundIncrease = this.calculatePlayerScoreIncrease(entry.getValue(),this.tricksWon.get(player));
            totalPoints = totalPoints + allianceNumber + endOfRoundIncrease;
            this.points.put(player,totalPoints);
        }
        tricksNumber ++;
        return this.points;
    }
    public void resetScoreRoundManager(){
        this.bets.clear();
        this.tricksWon.clear();
    }

    public void makePlayersAllies(Player player1, Player player2){
        Alliance alliance = new Alliance(player1,player2);
        this.alliances.add(alliance);
    }

    public boolean hasEveryoneBetted(){
        return this.points.size() == this.bets.size();
    }
    //PRIVATE

    private int calculateAllianceIncrease(Player player){
        int allianceNumber = 0;
        for (Alliance alliance : alliances){
            if (alliance.playerInAlliance(player)){
                allianceNumber++;
            }
        }
        return allianceNumber;
    }
    private int calculatePlayerScoreIncrease(int bet, int won){
        if (bet == 0){
            if (bet == won){
                return tricksNumber * 20;
            }
            else{
                return -tricksNumber * 20;
            }
        } else {
            if (bet == won){
                return bet * 20;
            }
            else{
                return -bet * -10;
            }
        }
    }

    public Map<Player,Integer> getBets() {
        return this.bets;
    }
}
