package skullKing.skullking.game.controller;

import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class RoomWebSocket extends TextWebSocketHandler {
    private final Map<UUID, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        UUID uuid = UUID.fromString(session.getUri().getQuery().split("=")[1]) ;
        userSessions.put(uuid, session);
    }


    public void sendMessageToRoom(String messageType, Object message) {

    }
}