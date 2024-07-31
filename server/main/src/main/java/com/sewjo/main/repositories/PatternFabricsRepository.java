package com.sewjo.main.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sewjo.main.models.PatternFabrics;

public interface PatternFabricsRepository extends JpaRepository<PatternFabrics, Long> {
    
}
