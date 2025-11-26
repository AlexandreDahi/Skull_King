package com.example.skullking.entities;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RoomCreationForm {

    @Schema(
        description = "Room's name",
        example = "The Dark Sailors",
        requiredMode = Schema.RequiredMode.REQUIRED)
    @Size(min=2, max=30)
    @NotNull
    public String name;


    /*RoomCreationForm() {
        this.name = "";
    }*/
}
