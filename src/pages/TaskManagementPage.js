// src/pages/TaskManagementPage.js
import React from 'react';
import { Box } from '@chakra-ui/react';
import TaskManagement from '../components/tasks/TaskManagement';
import { useParams } from 'react-router-dom';

const TaskManagementPage = () => {
  const { projectId } = useParams();

  return (
    <Box p={4}>
      <TaskManagement projectId={projectId} />
    </Box>
  );
};

export default TaskManagementPage;