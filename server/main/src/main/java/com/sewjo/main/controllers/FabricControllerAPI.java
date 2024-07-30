package com.sewjo.main.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sewjo.main.dto.FabricDTO;
import com.sewjo.main.models.Fabric;
import com.sewjo.main.service.FabricService;
import com.sewjo.main.service.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/fabric")
public class FabricControllerAPI {

    @Autowired
    private FabricService fabricService;

    @Autowired
    private UserService userServ;

    @Transactional
    @GetMapping("/all")
    public ResponseEntity<?> getAllFabrics(HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        List<FabricDTO> fabrics = fabricService.findAll(userId);
        return ResponseEntity.ok(fabrics);
    }

    @Transactional
    @GetMapping("/{id}")
    public ResponseEntity<?> getFabricById(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        FabricDTO fabric = fabricService.findById(id, userId);
        if (fabric == null) {
            return ResponseEntity.status(404).body("Fabric not found");
        }

        return ResponseEntity.ok(fabric);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createFabric(@RequestParam("name") String name,
                                          @RequestParam("length") Double length,
                                          @RequestParam("lengthInMeters") Boolean lengthInMeters,
                                          @RequestParam("width") Double width,
                                          @RequestParam("widthInCentimeters") Boolean widthInCentimeters,
                                          @RequestParam("remnant") Boolean remnant,
                                          @RequestParam(value = "image", required = false) MultipartFile imageFile,
                                          @RequestParam("composition") String composition,
                                          @RequestParam("structure") String structure,
                                          @RequestParam("color") String color,
                                          @RequestParam("print") String print,
                                          @RequestParam("description") String description,
                                          @RequestParam("brand") String brand,
                                          @RequestParam("shrinkage") Float shrinkage,
                                          @RequestParam("preWashed") Boolean preWashed,
                                          @RequestParam("careInstructions") String careInstructions,
                                          @RequestParam("location") String location,
                                          @RequestParam("stretch") Boolean stretch,
                                          @RequestParam("sheerness") Float sheerness,
                                          @RequestParam("drape") Float drape,
                                          @RequestParam("weight") Float weight,
                                          HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");

        try {
            FabricDTO fabric = fabricService.storeFabricUser(name, length, lengthInMeters, width, widthInCentimeters, remnant, imageFile,
                    composition, structure, color, print, description, brand, shrinkage, preWashed, careInstructions,
                    location, stretch, sheerness, drape, weight, userId);
            return ResponseEntity.status(200).body(fabric);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload fabric");
        }
    }

    @PutMapping(value = "/update/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateFabric(
        @PathVariable Long id,
        @RequestParam("name") String name,
        @RequestParam("length") Double length,
        @RequestParam("lengthInMeters") Boolean lengthInMeters,
        @RequestParam("width") Double width,
        @RequestParam("widthInCentimeters") Boolean widthInCentimeters,
        @RequestParam("remnant") Boolean remnant,
        @RequestParam(value = "image", required = false) MultipartFile imageFile,
        @RequestParam("composition") String composition,
        @RequestParam("structure") String structure,
        @RequestParam("color") String color,
        @RequestParam("print") String print,
        @RequestParam("description") String description,
        @RequestParam("brand") String brand,
        @RequestParam("shrinkage") Float shrinkage,
        @RequestParam("preWashed") Boolean preWashed,
        @RequestParam("careInstructions") String careInstructions,
        @RequestParam("location") String location,
        @RequestParam("stretch") Boolean stretch,
        @RequestParam("sheerness") Float sheerness,
        @RequestParam("drape") Float drape,
        @RequestParam("weight") Float weight,
        HttpSession session) {

        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        FabricDTO existingFabric = fabricService.findById(id, userId);
        if (existingFabric == null) {
            return ResponseEntity.status(404).body("Fabric not found");
        }

        FabricDTO fabricDto = new FabricDTO();
        fabricDto.setId(id);
        fabricDto.setName(name);
        fabricDto.setLength(length);
        fabricDto.setLengthInMeters(lengthInMeters);
        fabricDto.setWidth(width);
        fabricDto.setWidthInCentimeters(widthInCentimeters);
        fabricDto.setRemnant(remnant);
        fabricDto.setComposition(composition);
        fabricDto.setStructure(structure);
        fabricDto.setColor(color);
        fabricDto.setPrint(print);
        fabricDto.setDescription(description);
        fabricDto.setBrand(brand);
        fabricDto.setShrinkage(shrinkage);
        fabricDto.setPreWashed(preWashed);
        fabricDto.setCareInstructions(careInstructions);
        fabricDto.setLocation(location);
        fabricDto.setStretch(stretch);
        fabricDto.setSheerness(sheerness);
        fabricDto.setDrape(drape);
        fabricDto.setWeight(weight);
        fabricDto.setUserId(existingFabric.getUserId());

        FabricDTO updatedFabric;
        try {
            updatedFabric = fabricService.update(fabricDto, imageFile, userId);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to update fabric image");
        }

        return ResponseEntity.ok(updatedFabric);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFabric(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        boolean isDeleted = fabricService.deleteById(id, userId);
        if (!isDeleted) {
            return ResponseEntity.status(404).body("Fabric not found or you do not have permission to delete it");
        }
        return ResponseEntity.ok("Fabric deleted successfully");
    }
}
