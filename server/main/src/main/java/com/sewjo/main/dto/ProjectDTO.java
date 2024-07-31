package com.sewjo.main.dto;

import com.sewjo.main.models.SimpleFabric;
import java.util.List;

import com.sewjo.main.models.Project;

public class ProjectDTO {
    private Long id;
    private String name;
    private String instructions;
    private Long patternId;
    private List<SimpleFabric> readyFabrics;
    private Long userId;

    public ProjectDTO() {
    }

    public ProjectDTO(String name, String instructions, Long patternId, List<SimpleFabric> readyFabrics, Long userId) {
        this.name = name;
        this.instructions = instructions;
        this.patternId = patternId;
        this.readyFabrics = readyFabrics;
        this.userId = userId;
    }

    public ProjectDTO(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.instructions = project.getInstructions();
        this.patternId = project.getPattern().getId();
        this.readyFabrics = project.getReadyFabrics();
        this.userId = project.getUser().getId();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Long getPatternId() {
        return patternId;
    }

    public void setPatternId(Long patternId) {
        this.patternId = patternId;
    }

    public List<SimpleFabric> getReadyFabrics() {
        return readyFabrics;
    }

    public void setReadyFabrics(List<SimpleFabric> readyFabrics) {
        this.readyFabrics = readyFabrics;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
