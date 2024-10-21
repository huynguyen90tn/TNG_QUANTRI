import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const ProjectForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {}
  });

  const onSubmitForm = (data) => {
    if (initialData) {
      onSubmit(initialData.id, data);
    } else {
      onSubmit(data);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmitForm)}>
      <VStack spacing={4}>
        <FormControl isInvalid={errors.name}>
          <FormLabel>Project Name</FormLabel>
          <Input {...register('name', { required: 'Project name is required' })} />
        </FormControl>
        <FormControl isInvalid={errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea {...register('description')} />
        </FormControl>
        <FormControl isInvalid={errors.imageUrl}>
          <FormLabel>Image URL</FormLabel>
          <Input {...register('imageUrl')} />
        </FormControl>
        <FormControl isInvalid={errors.storyUrl}>
          <FormLabel>Story URL</FormLabel>
          <Input {...register('storyUrl')} />
        </FormControl>
        <FormControl isInvalid={errors.designUrl}>
          <FormLabel>2D Design URL</FormLabel>
          <Input {...register('designUrl')} />
        </FormControl>
        <FormControl isInvalid={errors.modelUrl}>
          <FormLabel>3D Model URL</FormLabel>
          <Input {...register('modelUrl')} />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </VStack>
    </Box>
  );
};

export default ProjectForm;