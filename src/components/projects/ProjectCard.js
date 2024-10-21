import React from 'react';
import { Box, Image, Text, Button, VStack, HStack, Link } from '@chakra-ui/react';

const ProjectCard = ({ project, onEdit, userRole }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={project.imageUrl} alt={project.name} />
      <Box p="6">
        <VStack align="start" spacing={3}>
          <Text fontWeight="bold" fontSize="xl">{project.name}</Text>
          <Text>{project.description}</Text>
          <HStack>
            <Link href={project.storyUrl} isExternal>
              <Button size="sm">Story</Button>
            </Link>
            <Link href={project.designUrl} isExternal>
              <Button size="sm">2D Design</Button>
            </Link>
            <Link href={project.modelUrl} isExternal>
              <Button size="sm">3D Model</Button>
            </Link>
          </HStack>
          {(userRole === 'admin-tong' || userRole === 'admin-con') && (
            <Button onClick={() => onEdit(project)} colorScheme="blue">
              Edit Project
            </Button>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default ProjectCard;