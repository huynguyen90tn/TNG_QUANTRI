import React from 'react';
import { Container, SimpleGrid, Heading, Text, Box, Center } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const MotionGrid = motion(SimpleGrid);

const ProjectList = ({ projects = [], onEdit, userRole }) => {
  // Validate projects array
  const validProjects = Array.isArray(projects) ? projects.filter(project => 
    project && typeof project === 'object' && project.id
  ) : [];

  return (
    <Container maxW="7xl" py={8}>
      <Box mb={8} textAlign="center">
        <Heading
          mb={4}
          fontSize={{ base: '2xl', md: '4xl' }}
          fontWeight="bold"
          color="blue.600"
        >
          Danh Sách Dự Án
        </Heading>
        <Text fontSize="lg" color="gray.600">
          {validProjects.length 
            ? `Hiện có ${validProjects.length} dự án đang được thực hiện`
            : 'Chưa có dự án nào được tạo'}
        </Text>
      </Box>

      {validProjects.length === 0 ? (
        <Center py={10}>
          <Text>Chưa có dự án nào</Text>
        </Center>
      ) : (
        <MotionGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={8}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {validProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard
                project={project}
                onEdit={onEdit}
                userRole={userRole}
              />
            </motion.div>
          ))}
        </MotionGrid>
      )}
    </Container>
  );
};

export default ProjectList;