package com.sewjo.main.dto;

import com.sewjo.main.models.Pattern;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Data transfer object for Pattern entity.
 */
public class PatternDTO {
    private Long id;
    private String name;
    private List<String> brand;
    private String description;
    private String patternType;
    private String format;
    private Integer difficulty;
    private List<String> tags;
    private Date releaseDate;
    private Boolean free;
    private Boolean outOfPrint;
    private Long imageId;
    private List<String> ageGroups;
    private String bodyType;
    private String sizeRange;
    private List<Character> cupSizes;
    private Double bustMin;
    private Double bustMax;
    private Double hipMin;
    private Double hipMax;
    private Boolean isImperial;
    private List<String> supplies;
    private Long userId;
    private List<PatternFabricsDTO> patternFabrics;

    public PatternDTO() {
    }

    public PatternDTO(Pattern pattern) {
        this.id = pattern.getId();
        this.name = pattern.getName();
        this.brand = pattern.getBrand();
        this.description = pattern.getDescription();
        this.patternType = pattern.getPatternType();
        this.format = pattern.getFormat();
        this.difficulty = pattern.getDifficulty();
        this.tags = pattern.getTags();
        this.releaseDate = pattern.getReleaseDate();
        this.free = pattern.getFree();
        this.outOfPrint = pattern.getOutOfPrint();
        this.imageId = pattern.getImage() != null ? pattern.getImage().getId() : null;
        this.ageGroups = pattern.getAgeGroups();
        this.bodyType = pattern.getBodyType();
        this.sizeRange = pattern.getSizeRange();
        this.cupSizes = pattern.getCupSizes();
        this.bustMin = pattern.getBustMin();
        this.bustMax = pattern.getBustMax();
        this.hipMin = pattern.getHipMin();
        this.hipMax = pattern.getHipMax();
        this.isImperial = pattern.getIsImperial();
        this.supplies = pattern.getSupplies();
        this.userId = pattern.getUser() != null ? pattern.getUser().getId() : null;
        this.patternFabrics = pattern.getPatternFabrics().stream()
                .map(PatternFabricsDTO::new)
                .collect(Collectors.toList());
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

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<PatternFabricsDTO> getPatternFabrics() {
        return patternFabrics;
    }

    public void setPatternFabrics(List<PatternFabricsDTO> patternFabrics) {
        this.patternFabrics = patternFabrics;
    }
}
