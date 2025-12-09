package com.example.skullking.exception;

public class NotPlayerTurnException extends RuntimeException{
    public NotPlayerTurnException(String errorMessage){
        super(errorMessage);
    }
}
