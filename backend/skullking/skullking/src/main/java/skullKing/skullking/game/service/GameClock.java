package skullKing.skullking.game.service;

import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;


public class GameClock {
    private final int CLOCK_TICK = 200; //in Milliseconds
    private final GameTasks gameTasks;

    UUID roomId;
    private ScheduledExecutorService scheduler;

    GameClock(UUID roomId) {
        this.gameTasks = new GameTasks();
        this.roomId = roomId;
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

    private void updateGameState() {
    }
}
