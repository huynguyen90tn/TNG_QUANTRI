import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, VStack, useToast, SimpleGrid } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import ProjectList from '../components/projects/ProjectList';
import ProjectForm from '../components/projects/ProjectForm';
import { getProjects, createProject, updateProject } from '../services/api/projectApi';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error fetching projects',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await createProject(projectData);
      setProjects([...projects, newProject]);
      setIsFormOpen(false);
      toast({
        title: 'Project created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error creating project',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProject = async (projectId, projectData) => {
    try {
      const updatedProject = await updateProject(projectId, projectData);
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
      setIsFormOpen(false);
      setEditingProject(null);
      toast({
        title: 'Project updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error updating project',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  return (
    <Box p={5}>
      <VStack spacing={5} align="stretch">
        <Heading>Project Management</Heading>
        {user.role === 'admin-tong' && (
          <Button colorScheme="blue" onClick={() => setIsFormOpen(true)}>
            Create New Project
          </Button>
        )}
        {isFormOpen && (
          <ProjectForm
            onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
            initialData={editingProject}
            onClose={() => {
              setIsFormOpen(false);
              setEditingProject(null);
            }}
          />
        )}
        <SimpleGrid columns={1} spacing={10}>
          <ProjectList projects={projects} onEdit={handleEditProject} />
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default ProjectManagement;