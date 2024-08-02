package com.sewjo.main.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "pattern_fabrics")
public class PatternFabrics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Size is required!")
    private String size;

    @OneToMany(mappedBy = "patternFabrics", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    // @NotEmpty(message = "Fabrics are required!")
    @JsonManagedReference
    private List<SimpleFabric> fabrics;

    @ManyToOne
    @JoinColumn(name = "pattern_id")
    @JsonBackReference
    private Pattern pattern;

    public PatternFabrics() {
    }

    public PatternFabrics(String size, List<SimpleFabric> fabrics) {
        this.size = size;
        this.fabrics = fabrics;
    }

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

    public List<SimpleFabric> getFabrics() {
        return fabrics;
    }

    public void setFabrics(List<SimpleFabric> fabrics) {
        this.fabrics = fabrics;
    }

    public Pattern getPattern() {
        return pattern;
    }

    public void setPattern(Pattern pattern) {
        this.pattern = pattern;
    }
}
