package com.sewjo.main.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "simple_fabrics")
public class SimpleFabric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Length is required!")
    @Min(value = 0, message = "Length must not be negative")
    private Double length;

    @NotNull(message = "Is length in meters is required!")
    private Boolean lengthInMeters;

    @NotNull(message = "Width is required!")
    @Min(value = 0, message = "Width must not be negative")
    private Double width;

    @NotNull(message = "Is width in centimeters is required!")
    private Boolean widthInCentimeters;

    private String forUse;

    @ManyToOne
    @JoinColumn(name = "pattern_fabrics_id")
    @JsonBackReference
    private PatternFabrics patternFabrics;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference("project-readyFabrics")
    private Project project;
    
    public SimpleFabric() {
    }

    public SimpleFabric(Double length, Boolean lengthInMeters, Double width, Boolean widthInCentimeters) {
        this.length = length;
        this.lengthInMeters = lengthInMeters;
        this.width = width;
        this.widthInCentimeters = widthInCentimeters;
    }

    public SimpleFabric(Double length, Boolean lengthInMeters, Double width, Boolean widthInCentimeters,
            String forUse) {
        this.length = length;
        this.lengthInMeters = lengthInMeters;
        this.width = width;
        this.widthInCentimeters = widthInCentimeters;
        this.forUse = forUse;
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public Boolean getLengthInMeters() {
        return lengthInMeters;
    }

    public void setLengthInMeters(Boolean lengthInMeters) {
        this.lengthInMeters = lengthInMeters;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Boolean getWidthInCentimeters() {
        return widthInCentimeters;
    }

    public void setWidthInCentimeters(Boolean widthInCentimeters) {
        this.widthInCentimeters = widthInCentimeters;
    }

    public String getForUse() {
        return forUse;
    }

    public void setForUse(String forUse) {
        this.forUse = forUse;
    }

    public PatternFabrics getPatternFabrics() {
        return patternFabrics;
    }

    public void setPatternFabrics(PatternFabrics patternFabrics) {
        this.patternFabrics = patternFabrics;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}