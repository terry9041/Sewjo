package com.sewjo.main.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "patterns")
public class Pattern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Pattern name is required!")
    private String name;

    @ElementCollection
    private List<String> brand;

    @NotEmpty(message = "Description is required!")
    private String description;

    @NotEmpty(message = "Pattern type is required!")
    private String patternType;

    private String format;

    private Integer difficulty;

    @ElementCollection
    private List<String> tags;

    @Temporal(TemporalType.DATE)
    private Date releaseDate;

    private Boolean free = false;

    private Boolean outOfPrint = false;

    private String image;

    @ElementCollection
    private List<String> ageGroups;

    private String bodyType;

    private String sizeRange;

    @ElementCollection
    private List<Character> cupSizes;

    private Double bustMin = 0.0;

    private Double bustMax = 0.0;

    private Double hipMin = 0.0;

    private Double hipMax = 0.0;

    @NotNull(message = "IsImperial status is required!")
    private Boolean isImperial;

    @ElementCollection
    private List<String> supplies;

    @NotEmpty(message = "Fabrics are required!")
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Fabric> fabrics;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Pattern() {
    }

    public Pattern(String name, List<String> brand, String description, String patternType, String format, Integer difficulty, List<String> tags, Date releaseDate, Boolean free, Boolean outOfPrint, String image, List<String> ageGroups, String bodyType, String sizeRange, List<Character> cupSizes, Double bustMin, Double bustMax, Double hipMin, Double hipMax, Boolean isImperial, List<String> supplies, List<Fabric> fabrics, User user) {
        this.name = name;
        this.brand = brand;
        this.description = description;
        this.patternType = patternType;
        this.format = format;
        this.difficulty = difficulty;
        this.tags = tags;
        this.releaseDate = releaseDate;
        this.free = free;
        this.outOfPrint = outOfPrint;
        this.image = image;
        this.ageGroups = ageGroups;
        this.bodyType = bodyType;
        this.sizeRange = sizeRange;
        this.cupSizes = cupSizes;
        this.bustMin = bustMin;
        this.bustMax = bustMax;
        this.hipMin = hipMin;
        this.hipMax = hipMax;
        this.isImperial = isImperial;
        this.supplies = supplies;
        this.fabrics = fabrics;
        this.user = user;
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

    public List<String> getBrand() {
        return brand;
    }

    public void setBrand(List<String> brand) {
        this.brand = brand;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPatternType() {
        return patternType;
    }

    public void setPatternType(String patternType) {
        this.patternType = patternType;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public Integer getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Integer difficulty) {
        this.difficulty = difficulty;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Boolean getFree() {
        return free;
    }

    public void setFree(Boolean free) {
        this.free = free;
    }

    public Boolean getOutOfPrint() {
        return outOfPrint;
    }

    public void setOutOfPrint(Boolean outOfPrint) {
        this.outOfPrint = outOfPrint;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<String> getAgeGroups() {
        return ageGroups;
    }

    public void setAgeGroups(List<String> ageGroups) {
        this.ageGroups = ageGroups;
    }

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public String getSizeRange() {
        return sizeRange;
    }

    public void setSizeRange(String sizeRange) {
        this.sizeRange = sizeRange;
    }

    public List<Character> getCupSizes() {
        return cupSizes;
    }

    public void setCupSizes(List<Character> cupSizes) {
        this.cupSizes = cupSizes;
    }

    public Double getBustMin() {
        return bustMin;
    }

    public void setBustMin(Double bustMin) {
        this.bustMin = bustMin;
    }

    public Double getBustMax() {
        return bustMax;
    }

    public void setBustMax(Double bustMax) {
        this.bustMax = bustMax;
    }

    public Double getHipMin() {
        return hipMin;
    }

    public void setHipMin(Double hipMin) {
        this.hipMin = hipMin;
    }

    public Double getHipMax() {
        return hipMax;
    }

    public void setHipMax(Double hipMax) {
        this.hipMax = hipMax;
    }

    public Boolean getIsImperial() {
        return isImperial;
    }

    public void setIsImperial(Boolean isImperial) {
        this.isImperial = isImperial;
    }

    public List<String> getSupplies() {
        return supplies;
    }

    public void setSupplies(List<String> supplies) {
        this.supplies = supplies;
    }

    public List<Fabric> getFabrics() {
        return fabrics;
    }

    public void setFabrics(List<Fabric> fabrics) {
        this.fabrics = fabrics;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double convertBustMinToCentimeters() {
        return isImperial ? bustMin * 2.54 : bustMin; // 1 inch = 2.54 centimeters
    }

    public double convertBustMinToInches() {
        return isImperial ? bustMin : bustMin / 2.54; // 1 centimeter = 0.393701 inches
    }

    public double convertBustMaxToCentimeters() {
        return isImperial ? bustMax * 2.54 : bustMax; // 1 inch = 2.54 centimeters
    }

    public double convertBustMaxToInches() {
        return isImperial ? bustMax : bustMax / 2.54; // 1 centimeter = 0.393701 inches
    }

    public double convertHipMinToCentimeters() {
        return isImperial ? hipMin * 2.54 : hipMin; // 1 inch = 2.54 centimeters
    }

    public double convertHipMinToInches() {
        return isImperial ? hipMin : hipMin / 2.54; // 1 centimeter = 0.393701 inches
    }

    public double convertHipMaxToCentimeters() {
        return isImperial ? hipMax * 2.54 : hipMax; // 1 inch = 2.54 centimeters
    }

    public double convertHipMaxToInches() {
        return isImperial ? hipMax : hipMax / 2.54; // 1 centimeter = 0.393701 inches
    }
}
