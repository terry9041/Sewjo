package com.sewjo.main.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sewjo.main.models.Fabric;

@Repository
public interface FabricRepository extends CrudRepository<Fabric, Long> {

    Optional<Fabric> findByName(String name);

    List<Fabric> findByColor(String color);

    List<Fabric> findByComposition(String composition);

    List<Fabric> findByUserId(Long userId);

    List<Fabric> findByPatternIdAndPatternUserId(Long patternId, Long userId);

    List<Fabric> findByUserIdAndPatternIsNull(Long userId);
}
