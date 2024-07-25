package com.sewjo.main.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.AssertTrue;

@Entity
@Table(name = "fabrics")
public class Fabric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Fabric name is required!")
    private String name;

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

    @NotNull(message = "Remnant status is required!")
    private Boolean remnant;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    @JsonBackReference("fabric-image")
    private Image image;
    private String composition;
    private String structure;
    private String color;
    private String print;
    private String description;
    private String brand;

    @DecimalMin(value = "0.0", message = "Shrinkage must be between 0 and 1")
    @DecimalMax(value = "1.0", message = "Shrinkage must be between 0 and 1")
    private Float shrinkage;

    private Boolean preWashed;
    private String careInstructions;
    private String location;

    @NotNull(message = "Stretch status is required!")
    private Boolean stretch;

    @NotNull(message = "Sheerness is required!")
    @DecimalMin(value = "0.0", message = "Sheerness must be between 0 and 1")
    @DecimalMax(value = "1.0", message = "Sheerness must be between 0 and 1")
    private Float sheerness;

    @NotNull(message = "Drape is required!")
    @DecimalMin(value = "0.0", message = "Drape must be between 0 and 1")
    @DecimalMax(value = "1.0", message = "Drape must be between 0 and 1")
    private Float drape;

    @NotNull(message = "Weight is required!")
    @DecimalMin(value = "0.0", message = "Weight must be between 0 and 1")
    @DecimalMax(value = "1.0", message = "Weight must be between 0 and 1")
    private Float weight;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-fabrics")
    private User user;

    @ManyToOne
    @JoinColumn(name = "pattern_id")
    @JsonBackReference("pattern-fabrics")
    private Pattern pattern;
    
    public Fabric() {
    }

    public Fabric(String name, Double length, Boolean lengthInMeters, Double width, Boolean widthInCentimeters, Boolean remnant, Boolean stretch, Float sheerness, Float drape, Float weight) {
        this.name = name;
        this.length = length;
        this.lengthInMeters = lengthInMeters;
        this.width = width;
        this.widthInCentimeters = widthInCentimeters;
        this.remnant = remnant;
        this.stretch = stretch;
        this.sheerness = sheerness;
        this.drape = drape;
        this.weight = weight;
    }

    public Fabric(String name, Double length, Boolean lengthInMeters, Double width, Boolean widthInCentimeters, Boolean remnant, Image image, String composition, String structure, String color, String print, String description, String brand, Float shrinkage, Boolean preWashed, String careInstructions, String location, Boolean stretch, Float sheerness, Float drape, Float weight, User user, Pattern pattern) {
        this.name = name;
        this.length = length;
        this.lengthInMeters = lengthInMeters;
        this.width = width;
        this.widthInCentimeters = widthInCentimeters;
        this.remnant = remnant;
        this.image = image;
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
        this.user = user;
        this.pattern = pattern;
    }

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

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pattern getPattern() {
        return pattern;
    }

    public void setPattern(Pattern pattern) {
        this.pattern = pattern;
    }

    @AssertTrue(message = "Fabric must be associated with either a user or a pattern, not both")
    private boolean isValidAssociation() {
        return (user == null && pattern == null) || (user != null && pattern == null) || (user == null && pattern != null);
    }

    public double convertLengthToMeters() {
        return lengthInMeters ? length : length * 0.9144; // 1 yard = 0.9144 meters
    }

    public double convertLengthToYards() {
        return lengthInMeters ? length / 0.9144 : length; // 1 meter = 1.09361 yards
    }

    public double convertWidthToCentimeters() {
        return widthInCentimeters ? width : width * 2.54; // 1 inch = 2.54 centimeters
    }

    public double convertWidthToInches() {
        return widthInCentimeters ? width / 2.54 : width; // 1 centimeter = 0.393701 inches
    }
}
