package com.example.skullking.entities.game;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;


public class GameClock {
    private final int CLOCK_TICK = 200; //in Milliseconds
    private final GameTasks gameTasks;
    private final AtomicInteger tick = new AtomicInteger(0);
    private ScheduledExecutorService scheduler;

    GameClock() {
        this.gameTasks = new GameTasks();

    }

    public void startClock() {
        this.scheduler = Executors.newScheduledThreadPool(2);
        Runnable task = () -> {
            try {
                this.updateGameState();
            } catch (Exception e) {
                e.printStackTrace();
            }
        };

        int delay = 0;
        scheduler.scheduleAtFixedRate(task, delay, this.CLOCK_TICK, TimeUnit.MILLISECONDS);
    }

    public void stopClock() {
        this.scheduler.shutdown();
    }

    private void updateGameState(int maxTime) {
        tick.incrementAndGet();
        if (tick.get()>= maxTime){

        }
        this.scheduler.shutdown();

    }
}
