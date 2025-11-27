package com.example.skullking.entities;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class RoomFormJoin {

    @Schema(
            description = "Tne name displayed to others players in the game",
            example = "Merciless pirate",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @Size(min=2, max=30)
    @NotNull
    public String playerName;

}