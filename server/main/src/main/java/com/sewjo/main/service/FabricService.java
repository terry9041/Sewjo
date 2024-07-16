package com.sewjo.main.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import com.sewjo.main.models.Fabric;
import com.sewjo.main.repositories.FabricRepository;

@Service
public class FabricService {

    @Autowired
    private FabricRepository fabricRepo;

    public List<Fabric> findAll(Long userId) {
        List<Fabric> userFabrics = fabricRepo.findByUserIdAndPatternIsNull(userId);
        List<Fabric> patternFabrics = fabricRepo.findByPatternIdAndPatternUserId(null, userId);
        userFabrics.addAll(patternFabrics);
        return userFabrics;
    }

    public Fabric save(Fabric fabric, BindingResult result) {
        // Perform any necessary validation here

        if (result.hasErrors()) {
            return null;
        }
        return fabricRepo.save(fabric);
    }

    public Fabric update(Fabric fabric, BindingResult result) {
        // Perform any necessary validation here

        if (result.hasErrors()) {
            return null;
        }
        return fabricRepo.save(fabric);
    }

    public boolean deleteById(Long id, Long userId) {
        Optional<Fabric> fabric = fabricRepo.findById(id);
        if (fabric.isPresent() && fabric.get().getUser().getId().equals(userId)) {
            fabricRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Fabric findById(Long id, Long userId) {
        Optional<Fabric> fabric = fabricRepo.findById(id);
        if (fabric.isPresent() && (fabric.get().getUser().getId().equals(userId) || fabric.get().getPattern().getUser().getId().equals(userId))) {
            return fabric.get();
        }
        return null;
    }

    public Optional<Fabric> findByName(String name, Long userId) {
        Optional<Fabric> fabric = fabricRepo.findByName(name);
        if (fabric.isPresent() && (fabric.get().getUser().getId().equals(userId) || fabric.get().getPattern().getUser().getId().equals(userId))) {
            return fabric;
        }
        return Optional.empty();
    }

    public List<Fabric> findByColor(String color, Long userId) {
        List<Fabric> fabrics = fabricRepo.findByColor(color);
        fabrics.removeIf(fabric -> !fabric.getUser().getId().equals(userId) && !fabric.getPattern().getUser().getId().equals(userId));
        return fabrics;
    }

    public List<Fabric> findByComposition(String composition, Long userId) {
        List<Fabric> fabrics = fabricRepo.findByComposition(composition);
        fabrics.removeIf(fabric -> !fabric.getUser().getId().equals(userId) && !fabric.getPattern().getUser().getId().equals(userId));
        return fabrics;
    }

    public List<Fabric> findByUserId(Long userId) {
        return fabricRepo.findByUserId(userId);
    }

    public List<Fabric> findByPatternIdAndPatternUserId(Long patternId, Long userId) {
        return fabricRepo.findByPatternIdAndPatternUserId(patternId, userId);
    }

    public List<Fabric> findByUserIdAndPatternIsNull(Long userId) {
        return fabricRepo.findByUserIdAndPatternIsNull(userId);
    }
}
