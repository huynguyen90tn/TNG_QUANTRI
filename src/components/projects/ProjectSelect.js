// H:\3 NGHIEN CUU\12 TNG WEB\tng-company-management\src\components\projects\ProjectSelect.js

import React, { useEffect, useState, useCallback } from 'react';
import { Select, useToast } from '@chakra-ui/react';
import { getProjects } from '../../services/api/projectApi';

const ProjectSelect = ({ value, onChange, isRequired = false, placeholder = "Chọn dự án" }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const projectsRes = await getProjects();
      setProjects(projectsRes || []);
    } catch (error) {
      toast({
        title: 'Lỗi khi tải danh sách dự án',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isRequired={isRequired}
      isDisabled={isLoading}
      _hover={{ borderColor: 'blue.500' }}
      transition="all 0.2s"
    >
      {projects.map((project) => (
        <option key={project.id} value={project.id}>
          {project.name}
        </option>
      ))}
    </Select>
  );
};

export default ProjectSelect;
