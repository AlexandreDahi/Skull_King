package com.example.skullking.entities.game;

import com.example.skullking.entities.Player;
import com.example.skullking.entities.game.cards.Card;
import com.example.skullking.entities.game.cards.CardManager;
import com.example.skullking.entities.game.cards.Hand;
import com.example.skullking.entities.game.cards.TrickResult;
import com.example.skullking.entities.game.dto.BetPlayer;
import com.example.skullking.entities.game.dto.CardPlayer;
import com.example.skullking.entities.game.score.ScoreManager;
import com.example.skullking.exception.IllegalInputException;
import com.example.skullking.exception.NotPlayerTurnException;

import java.util.*;
import java.util.concurrent.ScheduledFuture;


public class GameState {



    private int currentRound = 1;
    private int MAX_ROUND = 10;
    private final LinkedHashMap<Player, Card> cardPlayed = new LinkedHashMap<>();
    private final ScoreManager scoreManager = new ScoreManager();
    private final CardManager cardManager = new CardManager();
    private final GameLogic gameLogic = new GameLogic();
    LinkedHashMap<UUID,Player> players =new LinkedHashMap<>();
    private ScheduledFuture<?> scheduledTask;

    private GamePhase gamePhase;
    private Player currentPlayer;


    //INPUT
    public boolean startGame(List<Player> players) {
        for(Player player : players){
            this.players.put(player.getUuid(),player);
        }
        return true;
    }

    public void recordCardPlayed(CardPlayer cardPlayer) throws Exception{
        Card cardChosen = this.cardManager.playCard(cardPlayer.getPlayerId(), cardPlayer.getCardId());
        List<Card> cardPlayed = new ArrayList<>(this.cardPlayed.values());
        if (cardPlayed == null){
            throw new RuntimeException();
        }
        if (!isPlayerTurn(cardPlayer.getPlayerId())){
            throw new NotPlayerTurnException("Player try to play a card while not its turn");
        }
        if (!this.gameLogic.isCardPlayedLegal(cardPlayed, cardChosen,this.cardManager.getPlayerHand(cardPlayer.getPlayerId()))){
            throw new IllegalInputException("Card is illegal");
        }
        this.cardPlayed.put(players.get(cardPlayer.getPlayerId()),cardChosen);
    }


    public boolean recordBet(UUID playerId, Integer bet){
        if (players.containsKey(playerId)){
            this.scoreManager.setBet(bet,players.get(playerId));
            return true;
        }
        return false;
    }

    public TrickResult endOfTrick(){
        TrickResult trickResult = this.gameLogic.getTrickResult(this.cardPlayed);
        this.scoreManager.increaseScore(trickResult.getGoldAmount(), trickResult.getPlayer());
        return trickResult;
    }
    public Map<Player, Integer> endOfRound(){
        return this.scoreManager.calculateScoresEndOfPlayingPhase();
    }

    public Map<UUID,Hand> givePlayersCard() {
        Map<UUID,Hand> hands = new HashMap<>();
        for (Map.Entry<UUID,Player> players : players.entrySet()){
            cardManager.drawHand(players.getKey(),10);
            Hand hand = cardManager.getPlayerHand(players.getKey());
            if (hand == null){
                return null;
            }
            hands.put(players.getKey(),hand);

        }
        return hands;
    }



    public void cancelScheduledTask() {

        if (this.scheduledTask != null){
            this.scheduledTask.cancel(true);
            this.scheduledTask = null;
        }
    }

    public boolean hasEveryoneBet() {
        return this.scoreManager.hasEveryoneBetted();
    }
    public boolean hasEveryonePlayedACard() {
        return this.cardPlayed.size() == this.players.size();
    }

    public boolean isGameOver() {
        return this.currentRound > this.MAX_ROUND;
    }


    public void setCurrentPhase(GamePhase gamePhase) {this.gamePhase = gamePhase;}
    public GamePhase getCurrentPhase() {
        return this.gamePhase;
    }
    public Player getCurrentPlayer() {return this.currentPlayer;}

    public void setNextPlayer(){
        Iterator<Map.Entry<UUID, Player>> iterator = this.players.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<UUID, Player> currentEntry = iterator.next();
            if (currentEntry.getKey().equals(this.currentPlayer) ) {
                if (iterator.hasNext()){
                    this.currentPlayer = iterator.next().getValue();
                }else{
                    this.currentPlayer = this.players.entrySet().iterator().next().getValue();
                }

            }
        }}


    public boolean haveEveryCardsBeenPlayed() {
        for (Map.Entry<UUID,Player> player :players.entrySet()){
            Hand hand = this.cardManager.getPlayerHand(player.getKey());
            if (!hand.getCards().isEmpty()){
                return false;
            }
        }

        return true;
    }

    public List<BetPlayer> getBetList() {
        return this.scoreManager.getBets().entrySet().
                stream()
                .map(entry -> new BetPlayer(entry.getKey().getUuid(),entry.getValue()))
                .toList();
    }
    private boolean isPlayerTurn(UUID player){
        return player.equals(this.currentPlayer.getUuid());
    }
}





