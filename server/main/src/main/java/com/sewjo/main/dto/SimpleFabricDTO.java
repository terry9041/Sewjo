package com.sewjo.main.dto;

// import com.sewjo.main.models.PatternFabrics;
import com.sewjo.main.models.SimpleFabric;


class SimpleFabricDTO {
    private Long id;
    private Double length;
    private Boolean lengthInMeters;
    private Double width;
    private Boolean widthInCentimeters;
    private String forUse;

    public SimpleFabricDTO() {
    }

    public SimpleFabricDTO(SimpleFabric simpleFabric) {
        this.id = simpleFabric.getId();
        this.length = simpleFabric.getLength();
        this.lengthInMeters = simpleFabric.getLengthInMeters();
        this.width = simpleFabric.getWidth();
        this.widthInCentimeters = simpleFabric.getWidthInCentimeters();
        this.forUse = simpleFabric.getForUse();
    }

    // Getters and setters

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
}
