package com.example.skullking.entities.gameEvents;

public class ErrorEvent {

    public static GameEvent type = GameEvent.ERROR_EVENT;

    public String message;

    public ErrorEvent(String message) {
        this.message = message;
    }
}
