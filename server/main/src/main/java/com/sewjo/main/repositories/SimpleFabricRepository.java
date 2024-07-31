package com.sewjo.main.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sewjo.main.models.SimpleFabric;

public interface SimpleFabricRepository extends JpaRepository<SimpleFabric, Long> {
    
}
