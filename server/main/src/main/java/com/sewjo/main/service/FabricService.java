package com.sewjo.main.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import com.sewjo.main.dto.FabricDTO;
import com.sewjo.main.models.Fabric;
import com.sewjo.main.models.Image;
import com.sewjo.main.repositories.FabricRepository;

import jakarta.servlet.http.HttpSession;

@Service
public class FabricService {

    @Autowired
    private FabricRepository fabricRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private PatternService patternService;


    public List<FabricDTO> findAll(Long userId) {
        List<Fabric> fabrics = fabricRepo.findByUserId(userId);
        return fabrics.stream()
                .map(FabricDTO::new)
                .collect(Collectors.toList());
    }

    public FabricDTO findById(Long id, Long userId) {
        Optional<Fabric> fabric = fabricRepo.findById(id);
        if (fabric.isPresent() && (fabric.get().getUser().getId().equals(userId) || fabric.get().getPattern().getUser().getId().equals(userId))) {
            return new FabricDTO(fabric.get());
        }
        return null;
    }

    public Optional<FabricDTO> findByName(String name, Long userId) {
        Optional<Fabric> fabric = fabricRepo.findByName(name);
        if (fabric.isPresent() && (fabric.get().getUser().getId().equals(userId) || fabric.get().getPattern().getUser().getId().equals(userId))) {
            return Optional.of(new FabricDTO(fabric.get()));
        }
        return Optional.empty();
    }

    public List<FabricDTO> findByColor(String color, Long userId) {
        List<Fabric> fabrics = fabricRepo.findByColor(color);
        return fabrics.stream()
                .filter(fabric -> fabric.getUser().getId().equals(userId) || fabric.getPattern().getUser().getId().equals(userId))
                .map(FabricDTO::new)
                .collect(Collectors.toList());
    }

    public List<FabricDTO> findByComposition(String composition, Long userId) {
        List<Fabric> fabrics = fabricRepo.findByComposition(composition);
        return fabrics.stream()
                .filter(fabric -> fabric.getUser().getId().equals(userId) || fabric.getPattern().getUser().getId().equals(userId))
                .map(FabricDTO::new)
                .collect(Collectors.toList());
    }

    public List<FabricDTO> findByUserId(Long userId) {
        List<Fabric> fabrics = fabricRepo.findByUserId(userId);
        return fabrics.stream()
                .map(FabricDTO::new)
                .collect(Collectors.toList());
    }

    public List<FabricDTO> findByPatternIdAndPatternUserId(Long patternId, Long userId) {
        List<Fabric> fabrics = fabricRepo.findByPatternIdAndPatternUserId(patternId, userId);
        return fabrics.stream()
                .map(FabricDTO::new)
                .collect(Collectors.toList());
    }

    public List<FabricDTO> findByUserIdAndPatternIsNull(Long userId) {
        List<Fabric> fabrics = fabricRepo.findByUserIdAndPatternIsNull(userId);
        return fabrics.stream()
                .map(FabricDTO::new)
                .collect(Collectors.toList());
    }

    public Fabric save(Fabric fabric, BindingResult result) {
        if (result.hasErrors()) {
            return null;
        }
        return fabricRepo.save(fabric);
    }

    public FabricDTO update(FabricDTO fabricDto, MultipartFile imageFile, Long userId) throws IOException {
        Optional<Fabric> optionalFabric = fabricRepo.findById(fabricDto.getId());
        if (!optionalFabric.isPresent() || !optionalFabric.get().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Fabric not found or unauthorized");
        }

        Fabric existingFabric = optionalFabric.get();
        if (imageFile != null && !imageFile.isEmpty()) {
            Image image = new Image();
            image.setName(imageFile.getOriginalFilename());
            image.setData(imageFile.getBytes());
            existingFabric.setImage(image);
        }

        existingFabric.setName(fabricDto.getName());
        existingFabric.setLength(fabricDto.getLength());
        existingFabric.setLengthInMeters(fabricDto.getLengthInMeters());
        existingFabric.setWidth(fabricDto.getWidth());
        existingFabric.setWidthInCentimeters(fabricDto.getWidthInCentimeters());
        existingFabric.setRemnant(fabricDto.getRemnant());
        existingFabric.setComposition(fabricDto.getComposition());
        existingFabric.setStructure(fabricDto.getStructure());
        existingFabric.setColor(fabricDto.getColor());
        existingFabric.setPrint(fabricDto.getPrint());
        existingFabric.setDescription(fabricDto.getDescription());
        existingFabric.setBrand(fabricDto.getBrand());
        existingFabric.setShrinkage(fabricDto.getShrinkage());
        existingFabric.setPreWashed(fabricDto.getPreWashed());
        existingFabric.setCareInstructions(fabricDto.getCareInstructions());
        existingFabric.setLocation(fabricDto.getLocation());
        existingFabric.setStretch(fabricDto.getStretch());
        existingFabric.setSheerness(fabricDto.getSheerness());
        existingFabric.setDrape(fabricDto.getDrape());
        existingFabric.setWeight(fabricDto.getWeight());

        Fabric updatedFabric = fabricRepo.save(existingFabric);
        return new FabricDTO(updatedFabric);
    }


    public boolean deleteById(Long id, Long userId) {
        Optional<Fabric> fabric = fabricRepo.findById(id);
        if (fabric.isPresent() && fabric.get().getUser().getId().equals(userId)) {
            fabricRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public FabricDTO storeFabric(String name, Double length, Boolean lengthInMeters, Double width, Boolean widthInCentimeters,
                              Boolean remnant, MultipartFile imageFile, String composition, String structure, String color,
                              String print, String description, String brand, Float shrinkage, Boolean preWashed,
                              String careInstructions, String location, Boolean stretch, Float sheerness, Float drape,
                              Float weight, Long userId) throws IOException {
                                
        Image image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = new Image();
            image.setName(imageFile.getOriginalFilename());
            image.setData(imageFile.getBytes());
        }

        Fabric fabric = new Fabric(name, length, lengthInMeters, width, widthInCentimeters, remnant, stretch, sheerness, drape, weight);
        fabric.setImage(image);
        fabric.setComposition(composition);
        fabric.setStructure(structure);
        fabric.setColor(color);
        fabric.setPrint(print);
        fabric.setDescription(description);
        fabric.setBrand(brand);
        fabric.setShrinkage(shrinkage);
        fabric.setPreWashed(preWashed);
        fabric.setCareInstructions(careInstructions);
        fabric.setLocation(location);
        fabric.setUser(userService.findById(userId));

        fabricRepo.save(fabric);

        return new FabricDTO(fabric);
    }
}
