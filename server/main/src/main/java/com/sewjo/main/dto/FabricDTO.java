package com.sewjo.main.dto;

import com.sewjo.main.models.Fabric;

/**
 * FabricDTO
 */
public class FabricDTO {
    private Long id;
    private String name;
    private Double length;
    private Boolean lengthInMeters;
    private Double width;
    private Boolean widthInCentimeters;
    private Boolean remnant;
    private Long imageId;
    private String composition;
    private String structure;
    private String color;
    private String print;
    private String description;
    private String brand;
    private Float shrinkage;
    private Boolean preWashed;
    private String careInstructions;
    private String location;
    private Boolean stretch;
    private Float sheerness;
    private Float drape;
    private Float weight;
    private Long userId; 
    // private Long patternId;

    public FabricDTO() {
    }
    
    public FabricDTO(Fabric fabric) {
        this.id = fabric.getId();
        this.name = fabric.getName();
        this.length = fabric.getLength();
        this.lengthInMeters = fabric.getLengthInMeters();
        this.width = fabric.getWidth();
        this.widthInCentimeters = fabric.getWidthInCentimeters();
        this.remnant = fabric.getRemnant();
        this.composition = fabric.getComposition();
        this.structure = fabric.getStructure();
        this.color = fabric.getColor();
        this.print = fabric.getPrint();
        this.description = fabric.getDescription();
        this.brand = fabric.getBrand();
        this.shrinkage = fabric.getShrinkage();
        this.preWashed = fabric.getPreWashed();
        this.careInstructions = fabric.getCareInstructions();
        this.location = fabric.getLocation();
        this.stretch = fabric.getStretch();
        this.sheerness = fabric.getSheerness();
        this.drape = fabric.getDrape();
        this.weight = fabric.getWeight();
        this.imageId = fabric.getImage() != null ? fabric.getImage().getId() : null;
        this.userId = fabric.getUser() != null ? fabric.getUser().getId() : null;
        // this.patternId = fabric.getPattern() != null ? fabric.getPattern().getId() : null;
    }

    public FabricDTO(Long id, String name, Double length, Boolean lengthInMeters, Double width, Boolean widthInCentimeters, Boolean remnant, Long imageId, String composition, String structure, String color, String print, String description, String brand, Float shrinkage, Boolean preWashed, String careInstructions, String location, Boolean stretch, Float sheerness, Float drape, Float weight, Long userId) {
        this.id = id;
        this.name = name;
        this.length = length;
        this.lengthInMeters = lengthInMeters;
        this.width = width;
        this.widthInCentimeters = widthInCentimeters;
        this.remnant = remnant;
        this.imageId = imageId;
        this.composition = composition;
        this.structure = structure;
        this.color = color;
        this.print = print;
        this.description = description;
        this.brand = brand;
        this.shrinkage = shrinkage;
        this.preWashed = preWashed;
        this.careInstructions = careInstructions;
        this.location = location;
        this.stretch = stretch;
        this.sheerness = sheerness;
        this.drape = drape;
        this.weight = weight;
        this.userId = userId;
        // this.patternId = patternId;
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

    public Boolean getRemnant() {
        return remnant;
    }

    public void setRemnant(Boolean remnant) {
        this.remnant = remnant;
    }

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    public String getComposition() {
        return composition;
    }

    public void setComposition(String composition) {
        this.composition = composition;
    }

    public String getStructure() {
        return structure;
    }

    public void setStructure(String structure) {
        this.structure = structure;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getPrint() {
        return print;
    }

    public void setPrint(String print) {
        this.print = print;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Float getShrinkage() {
        return shrinkage;
    }

    public void setShrinkage(Float shrinkage) {
        this.shrinkage = shrinkage;
    }

    public Boolean getPreWashed() {
        return preWashed;
    }

    public void setPreWashed(Boolean preWashed) {
        this.preWashed = preWashed;
    }

    public String getCareInstructions() {
        return careInstructions;
    }

    public void setCareInstructions(String careInstructions) {
        this.careInstructions = careInstructions;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getStretch() {
        return stretch;
    }

    public void setStretch(Boolean stretch) {
        this.stretch = stretch;
    }

    public Float getSheerness() {
        return sheerness;
    }

    public void setSheerness(Float sheerness) {
        this.sheerness = sheerness;
    }

    public Float getDrape() {
        return drape;
    }

    public void setDrape(Float drape) {
        this.drape = drape;
    }

    public Float getWeight() {
        return weight;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // public Long getPatternId() {
    //     return patternId;
    // }

    // public void setPatternId(Long patternId) {
    //     this.patternId = patternId;
    // }
}
