package com.sewjo.main.service;

import com.sewjo.main.dto.ProjectDTO;
import com.sewjo.main.models.Project;
import com.sewjo.main.repositories.ProjectRepository;
// import com.sewjo.main.models.SimpleFabric;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private PatternService patternService;

    public List<ProjectDTO> findAll(Long userId) {
        List<Project> projects = projectRepo.findByUserId(userId);
        return projects.stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }

    public ProjectDTO findById(Long id, Long userId) {
        Optional<Project> project = projectRepo.findById(id);
        if (project.isPresent() && project.get().getUser().getId().equals(userId)) {
            return new ProjectDTO(project.get());
        }
        return null;
    }

    public ProjectDTO createProject(ProjectDTO projectDTO, Long userId) {
        Project project = new Project();
        project.setName(projectDTO.getName());
        project.setInstructions(projectDTO.getInstructions());
        project.setUser(userService.findById(userId));
        project.setPattern(patternService.findByIdFull(projectDTO.getPatternId(), userId));
        project.setReadyFabrics(projectDTO.getReadyFabrics());

        Project savedProject = projectRepo.save(project);

        return new ProjectDTO(savedProject);
    }

    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO, Long userId) {
        Optional<Project> optionalProject = projectRepo.findById(id);
        if (!optionalProject.isPresent()) {
            return null;
        }

        Project existingProject = optionalProject.get();
        if (!existingProject.getUser().getId().equals(userId)) {
            return null;
        }

        existingProject.setName(projectDTO.getName());
        existingProject.setInstructions(projectDTO.getInstructions());
        existingProject.setPattern(patternService.findByIdFull(projectDTO.getPatternId(), userId));
        existingProject.setReadyFabrics(projectDTO.getReadyFabrics());

        Project updatedProject = projectRepo.save(existingProject);
        return new ProjectDTO(updatedProject);
    }

    public boolean deleteById(Long id, Long userId) {
        Optional<Project> project = projectRepo.findById(id);
        if (project.isPresent() && project.get().getUser().getId().equals(userId)) {
            projectRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
