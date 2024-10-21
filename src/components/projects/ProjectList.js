import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, onEdit, userRole }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          userRole={userRole}
        />
      ))}
    </SimpleGrid>
  );
};

export default ProjectList;