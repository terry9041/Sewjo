package com.sewjo.main.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sewjo.main.models.Pattern;

@Repository
public interface PatternRepository extends CrudRepository<Pattern, Long> {

    Optional<Pattern> findByName(String name);

    List<Pattern> findByDesigner(String designer);

    List<Pattern> findByPatternType(String patternType);

    List<Pattern> findByUserId(Long userId);

    List<Pattern> findByTagsContaining(String tag);
}
