package com.sewjo.main.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sewjo.main.dto.PatternDTO;
import com.sewjo.main.models.Image;
import com.sewjo.main.models.Pattern;
import com.sewjo.main.models.PatternFabrics;
import com.sewjo.main.models.SimpleFabric;
import com.sewjo.main.repositories.PatternRepository;
import com.sewjo.main.repositories.PatternFabricsRepository;
// import com.sewjo.main.repositories.SimpleFabricRepository;

@Service
public class PatternService {

    @Autowired
    private PatternRepository patternRepo;

    @Autowired
    private PatternFabricsRepository patternFabricsRepo;

    // @Autowired
    // private SimpleFabricRepository simpleFabricRepo;

    @Autowired
    private UserService userService;

    public List<PatternDTO> findAll(Long userId) {
        List<Pattern> patterns = patternRepo.findByUserId(userId);
        return patterns.stream()
                .map(PatternDTO::new)
                .collect(Collectors.toList());
    }

    public PatternDTO findById(Long id, Long userId) {
        Optional<Pattern> pattern = patternRepo.findById(id);
        if (pattern.isPresent() && pattern.get().getUser().getId().equals(userId)) {
            return new PatternDTO(pattern.get());
        }
        return null;
    }

    public Pattern findByIdFull(Long id, Long userId) {
        Optional<Pattern> pattern = patternRepo.findById(id);
        if (pattern.isPresent() && pattern.get().getUser().getId().equals(userId)) {
            return pattern.get();
        }
        return null;
    }

    public PatternDTO save(PatternDTO patternDTO) {
        Pattern pattern = new Pattern();
        pattern.setName(patternDTO.getName());
        pattern.setBrand(patternDTO.getBrand());
        pattern.setDescription(patternDTO.getDescription());
        pattern.setPatternType(patternDTO.getPatternType());
        pattern.setFormat(patternDTO.getFormat());
        pattern.setDifficulty(patternDTO.getDifficulty());
        pattern.setTags(patternDTO.getTags());
        pattern.setReleaseDate(patternDTO.getReleaseDate());
        pattern.setFree(patternDTO.getFree());
        pattern.setOutOfPrint(patternDTO.getOutOfPrint());
        pattern.setAgeGroups(patternDTO.getAgeGroups());
        pattern.setBodyType(patternDTO.getBodyType());
        pattern.setSizeRange(patternDTO.getSizeRange());
        pattern.setCupSizes(patternDTO.getCupSizes());
        pattern.setBustMin(patternDTO.getBustMin());
        pattern.setBustMax(patternDTO.getBustMax());
        pattern.setHipMin(patternDTO.getHipMin());
        pattern.setHipMax(patternDTO.getHipMax());
        pattern.setIsImperial(patternDTO.getIsImperial());
        pattern.setSupplies(patternDTO.getSupplies());

        pattern.setUser(userService.findById(patternDTO.getUserId()));

        Pattern savedPattern = patternRepo.save(pattern);
        return new PatternDTO(savedPattern);
    }

    public PatternDTO update(PatternDTO patternDTO, MultipartFile imageFile) throws IOException {
        Optional<Pattern> optionalPattern = patternRepo.findById(patternDTO.getId());
        if (!optionalPattern.isPresent()) {
            return null;
        }

        Pattern existingPattern = optionalPattern.get();
        if (imageFile != null && !imageFile.isEmpty()) {
            Image image = new Image();
            image.setName(imageFile.getOriginalFilename());
            image.setData(imageFile.getBytes());
            existingPattern.setImage(image);
        }

        existingPattern.setName(patternDTO.getName());
        existingPattern.setBrand(patternDTO.getBrand());
        existingPattern.setDescription(patternDTO.getDescription());
        existingPattern.setPatternType(patternDTO.getPatternType());
        existingPattern.setFormat(patternDTO.getFormat());
        existingPattern.setDifficulty(patternDTO.getDifficulty());
        existingPattern.setTags(patternDTO.getTags());
        existingPattern.setReleaseDate(patternDTO.getReleaseDate());
        existingPattern.setFree(patternDTO.getFree());
        existingPattern.setOutOfPrint(patternDTO.getOutOfPrint());
        existingPattern.setAgeGroups(patternDTO.getAgeGroups());
        existingPattern.setBodyType(patternDTO.getBodyType());
        existingPattern.setSizeRange(patternDTO.getSizeRange());
        existingPattern.setCupSizes(patternDTO.getCupSizes());
        existingPattern.setBustMin(patternDTO.getBustMin());
        existingPattern.setBustMax(patternDTO.getBustMax());
        existingPattern.setHipMin(patternDTO.getHipMin());
        existingPattern.setHipMax(patternDTO.getHipMax());
        existingPattern.setIsImperial(patternDTO.getIsImperial());
        existingPattern.setSupplies(patternDTO.getSupplies());

        Pattern updatedPattern = patternRepo.save(existingPattern);
        return new PatternDTO(updatedPattern);
    }

    public boolean deleteById(Long id, Long userId) {
        Optional<Pattern> pattern = patternRepo.findById(id);
        if (pattern.isPresent() && pattern.get().getUser().getId().equals(userId)) {
            patternRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public PatternDTO storePattern(String name, List<String> brand, String description, String patternType, String format,
                                   Integer difficulty, List<String> tags, Date releaseDate, Boolean free, Boolean outOfPrint,
                                   MultipartFile imageFile, List<String> ageGroups, String bodyType, String sizeRange,
                                   List<Character> cupSizes, Double bustMin, Double bustMax, Double hipMin, Double hipMax,
                                   Boolean isImperial, List<String> supplies, List<PatternFabrics> patternFabrics, Long userId)
            throws IOException {

        Image image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = new Image();
            image.setName(imageFile.getOriginalFilename());
            image.setData(imageFile.getBytes());
        }

        Pattern pattern = new Pattern();
        pattern.setName(name);
        pattern.setBrand(brand);
        pattern.setDescription(description);
        pattern.setPatternType(patternType);
        pattern.setFormat(format);
        pattern.setDifficulty(difficulty);
        pattern.setTags(tags);
        pattern.setReleaseDate(releaseDate);
        pattern.setFree(free);
        pattern.setOutOfPrint(outOfPrint);
        pattern.setImage(image);
        pattern.setAgeGroups(ageGroups);
        pattern.setBodyType(bodyType);
        pattern.setSizeRange(sizeRange);
        pattern.setCupSizes(cupSizes);
        pattern.setBustMin(bustMin);
        pattern.setBustMax(bustMax);
        pattern.setHipMin(hipMin);
        pattern.setHipMax(hipMax);
        pattern.setIsImperial(isImperial);
        pattern.setSupplies(supplies);
        pattern.setPatternFabrics(patternFabrics);
        pattern.setUser(userService.findById(userId));

        pattern = patternRepo.save(pattern);

        for (PatternFabrics pf : patternFabrics) {
            pf.setPattern(pattern);
            pf = patternFabricsRepo.save(pf); 
            List<SimpleFabric> simpleFabrics = new ArrayList<>();
            for (SimpleFabric sf : pf.getFabrics()) {
                sf.setPatternFabrics(pf);
                simpleFabrics.add(sf);
            }
            pf.setFabrics(simpleFabrics);
            patternFabricsRepo.save(pf);
        }

        pattern.setPatternFabrics(patternFabrics);
        pattern = patternRepo.save(pattern);
        return new PatternDTO(pattern);
    }

    public PatternDTO updatePattern(Long id, String name, List<String> brand, String description, String patternType,
                                    String format, Integer difficulty, List<String> tags, Date releaseDate, Boolean free,
                                    Boolean outOfPrint, MultipartFile imageFile, List<String> ageGroups, String bodyType,
                                    String sizeRange, List<Character> cupSizes, Double bustMin, Double bustMax, Double hipMin,
                                    Double hipMax, Boolean isImperial, List<String> supplies, List<PatternFabrics> patternFabrics,
                                    Long userId) throws IOException {

        Optional<Pattern> optionalPattern = patternRepo.findById(id);
        if (!optionalPattern.isPresent()) {
            return null;
        }

        Pattern existingPattern = optionalPattern.get();

        Image image = existingPattern.getImage();
        if (imageFile != null && !imageFile.isEmpty()) {
            image = new Image();
            image.setName(imageFile.getOriginalFilename());
            image.setData(imageFile.getBytes());
        }

        existingPattern.setName(name);
        existingPattern.setBrand(brand);
        existingPattern.setDescription(description);
        existingPattern.setPatternType(patternType);
        existingPattern.setFormat(format);
        existingPattern.setDifficulty(difficulty);
        existingPattern.setTags(tags);
        existingPattern.setReleaseDate(releaseDate);
        existingPattern.setFree(free);
        existingPattern.setOutOfPrint(outOfPrint);
        existingPattern.setImage(image);
        existingPattern.setAgeGroups(ageGroups);
        existingPattern.setBodyType(bodyType);
        existingPattern.setSizeRange(sizeRange);
        existingPattern.setCupSizes(cupSizes);
        existingPattern.setBustMin(bustMin);
        existingPattern.setBustMax(bustMax);
        existingPattern.setHipMin(hipMin);
        existingPattern.setHipMax(hipMax);
        existingPattern.setIsImperial(isImperial);
        existingPattern.setSupplies(supplies);
        existingPattern.setPatternFabrics(patternFabrics);
        existingPattern.setUser(userService.findById(userId));

        Pattern updatedPattern = patternRepo.save(existingPattern);

        for (PatternFabrics pf : patternFabrics) {
            pf.setPattern(updatedPattern);
            pf = patternFabricsRepo.save(pf); 
            List<SimpleFabric> simpleFabrics = new ArrayList<>();
            for (SimpleFabric sf : pf.getFabrics()) {
                sf.setPatternFabrics(pf);
                simpleFabrics.add(sf);
            }
            pf.setFabrics(simpleFabrics);
            patternFabricsRepo.save(pf);
        }

        updatedPattern.setPatternFabrics(patternFabrics);
        updatedPattern = patternRepo.save(updatedPattern);
        return new PatternDTO(updatedPattern);
    }
}
