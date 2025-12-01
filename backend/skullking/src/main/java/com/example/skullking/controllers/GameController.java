package com.example.skullking.controllers;


import com.example.skullking.entities.gameEvents.BaseEvent;
import com.example.skullking.entities.gameEvents.SendBetEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;




class Message {

    public String content;


    public Message(String content) {
        this.content = content;
    }
}

@Controller
public class GameController {


    private SimpMessagingTemplate template;

    @Autowired
    public GameController(SimpMessagingTemplate template) {
        this.template = template;
    }


    @MessageMapping("/rooms/{roomUuid}/users/{userUuid}")
    //@SendTo("/topic/messages")
    public void join(@DestinationVariable String roomUuid, @DestinationVariable String userUuid, @Payload BaseEvent message) {

        boolean isMyObj = message instanceof SendBetEvent;

        System.out.println("castable ? " + isMyObj);

        this.template.convertAndSend("/topic/messages", new Message("roome : " + roomUuid + ", user : " + userUuid));
        //return new Message("room : " + roomUuid + ", user : " + userUuid);
    }
}
