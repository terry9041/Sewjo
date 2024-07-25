package com.sewjo.main.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sewjo.main.models.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
