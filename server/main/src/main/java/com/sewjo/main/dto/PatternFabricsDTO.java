package com.sewjo.main.dto;

import com.sewjo.main.models.PatternFabrics;
// import com.sewjo.main.models.SimpleFabric;

import java.util.List;
import java.util.stream.Collectors;

public class PatternFabricsDTO {
    private Long id;
    private String size;
    private List<SimpleFabricDTO> fabrics;

    public PatternFabricsDTO() {
    }

    public PatternFabricsDTO(PatternFabrics patternFabrics) {
        this.id = patternFabrics.getId();
        this.size = patternFabrics.getSize();
        this.fabrics = patternFabrics.getFabrics().stream()
                .map(SimpleFabricDTO::new)
                .collect(Collectors.toList());
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public List<SimpleFabricDTO> getFabrics() {
        return fabrics;
    }

    public void setFabrics(List<SimpleFabricDTO> fabrics) {
        this.fabrics = fabrics;
    }
}
