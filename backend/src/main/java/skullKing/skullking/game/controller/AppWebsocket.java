package skullKing.skullking.game.controller;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class AppWebsocket {
    private final Map<UUID,RoomWebSocket> roomSessions = new HashMap<>();

    public void createRoom(){

    }

    public void sendMessageToRoom(UUID uuid){
        RoomWebSocket roomWebSocket = this.roomSessions.get(uuid);
        roomWebSocket.sendMessageToRoom("message", 0);
    }
}