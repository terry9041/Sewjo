package com.sewjo.main.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import com.sewjo.main.models.Pattern;
import com.sewjo.main.repositories.PatternRepository;

@Service
public class PatternService {

    @Autowired
    private PatternRepository patternRepo;

    public List<Pattern> findAll(Long userId) {
        return patternRepo.findByUserId(userId);
    }

    public Pattern save(Pattern pattern, BindingResult result) {
        // Perform any necessary validation here

        if (result.hasErrors()) {
            return null;
        }
        return patternRepo.save(pattern);
    }

    public Pattern update(Pattern pattern, BindingResult result) {
        // Perform any necessary validation here

        if (result.hasErrors()) {
            return null;
        }
        return patternRepo.save(pattern);
    }

    public boolean deleteById(Long id, Long userId) {
        Optional<Pattern> pattern = patternRepo.findById(id);
        if (pattern.isPresent() && pattern.get().getUser().getId().equals(userId)) {
            patternRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Pattern findById(Long id, Long userId) {
        Optional<Pattern> pattern = patternRepo.findById(id);
        if (pattern.isPresent() && pattern.get().getUser().getId().equals(userId)) {
            return pattern.get();
        }
        return null;
    }

    public Optional<Pattern> findByName(String name, Long userId) {
        Optional<Pattern> pattern = patternRepo.findByName(name);
        if (pattern.isPresent() && pattern.get().getUser().getId().equals(userId)) {
            return pattern;
        }
        return Optional.empty();
    }

    public List<Pattern> findByDesigner(String brand, Long userId) {
        List<Pattern> patterns = patternRepo.findByBrand(brand);
        patterns.removeIf(pattern -> !pattern.getUser().getId().equals(userId));
        return patterns;
    }

    public List<Pattern> findByPatternType(String patternType, Long userId) {
        List<Pattern> patterns = patternRepo.findByPatternType(patternType);
        patterns.removeIf(pattern -> !pattern.getUser().getId().equals(userId));
        return patterns;
    }

    public List<Pattern> findByTagsContaining(String tag, Long userId) {
        List<Pattern> patterns = patternRepo.findByTagsContaining(tag);
        patterns.removeIf(pattern -> !pattern.getUser().getId().equals(userId));
        return patterns;
    }
}
