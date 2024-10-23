// src/components/projects/ProjectForm.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  SimpleGrid,
  Heading,
  FormErrorMessage,
  Progress,
  Select,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  IconButton,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Collapse,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Badge,
  AspectRatio,
  Container,
  Divider,
  Text,
} from '@chakra-ui/react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  AddIcon,
  LinkIcon,
  DeleteIcon,
  CalendarIcon,
  ExternalLinkIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';
import { FiYoutube } from 'react-icons/fi';
import { getUserList } from '../../services/api/userApi';

const FormSection = ({ title, icon, children }) => {
  const bgColor = useColorModeValue('gray.700', 'gray.800');
  const borderColor = useColorModeValue('gray.600', 'gray.700');

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg={bgColor}
      borderColor={borderColor}
    >
      <Stack direction="row" align="center" mb={4}>
        {icon}
        <Heading size="sm">{title}</Heading>
      </Stack>
      {children}
    </Box>
  );
};

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
};

const ProjectForm = ({ onSubmit, initialData, onCancel, userRole }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [isLoadingAssignees, setIsLoadingAssignees] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const inputBgColor = useColorModeValue('gray.700', 'gray.800');
  const textColor = useColorModeValue('gray.100', 'gray.200');
  const borderColor = useColorModeValue('gray.600', 'gray.700');

  // Fetch danh sách admin con
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        setIsLoadingAssignees(true);
        const response = await getUserList({ role: 'admin-con' });
        if (response && response.data) {
          setAssignees(response.data);
        }
      } catch (error) {
        toast({
          title: 'Lỗi tải danh sách người thực hiện',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingAssignees(false);
      }
    };

    fetchAssignees();
  }, [toast]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      videoUrl: '',
      imageUrl: '',
      status: 'đang-chờ',
      progress: 0,
      tasks: [],
      departmentLinks: {
        coding: '',
        design2D: '',
        design3D: '',
        filmProduction: '',
        marketing: '',
        gameDesign: '',
        story: '',
      },
      milestones: [],
      links: [],
    },
  });

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control,
    name: 'tasks',
  });

  const {
    fields: milestoneFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({
    control,
    name: 'milestones',
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: 'links',
  });

  const watchedTasks = watch('tasks') || [];
  const videoUrl = watch('videoUrl');

  const calculateTotalProgress = () => {
    if (watchedTasks.length === 0) return 0;
    const totalProgress = watchedTasks.reduce(
      (sum, task) => sum + (Number(task.progress) || 0),
      0
    );
    return Math.round(totalProgress / watchedTasks.length);
  };

  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const validateYoutubeUrl = (url) => {
    if (!url) return true;
    return !!getYoutubeVideoId(url);
  };

  const onFormSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (endDate < startDate) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }

      if (data.videoUrl && !validateYoutubeUrl(data.videoUrl)) {
        throw new Error('Link YouTube không hợp lệ');
      }

      const invalidTask = data.tasks?.find(
        (task) =>
          task.deadline &&
          (new Date(task.deadline) < startDate ||
            new Date(task.deadline) > endDate)
      );

      if (invalidTask) {
        throw new Error('Deadline công việc phải nằm trong thời gian dự án');
      }

      const totalProgress = calculateTotalProgress();
      data.progress = totalProgress;

      await onSubmit(data);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="full" p={0}>
      <Box
        as="form"
        onSubmit={handleSubmit(onFormSubmit)}
        bg={bgColor}
        p={6}
        borderRadius="lg"
        width="100%"
        mx="auto"
        position="relative"
        height="auto"
        overflowY="auto"
        color={textColor}
        borderWidth="1px"
        borderColor={borderColor}
        sx={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
            bg: 'gray.700',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.500',
            borderRadius: '24px',
          },
        }}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg" color="blue.300">
            {initialData ? 'Cập Nhật Dự Án' : 'Tạo Dự Án Mới'}
          </Heading>

          {/* Thông Tin Cơ Bản */}
          <FormSection title="Thông Tin Cơ Bản">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={errors.name} isRequired>
                <FormLabel>Tên Dự Án</FormLabel>
                <Input
                  {...register('name', {
                    required: 'Vui lòng nhập tên dự án',
                    minLength: {
                      value: 3,
                      message: 'Tên dự án phải có ít nhất 3 ký tự',
                    },
                  })}
                  placeholder="Nhập tên dự án"
                  bg={inputBgColor}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.description}>
                <FormLabel>Mô Tả</FormLabel>
                <Textarea
                  {...register('description')}
                  placeholder="Nhập mô tả dự án"
                  rows={3}
                  bg={inputBgColor}
                />
                <FormErrorMessage>
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </FormSection>

          {/* Ngày Bắt Đầu và Kết Thúc */}
          <FormSection title="Thời Gian Dự Án" icon={<CalendarIcon />}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={errors.startDate} isRequired>
                <FormLabel>Ngày Bắt Đầu</FormLabel>
                <Input
                  {...register('startDate', {
                    required: 'Vui lòng chọn ngày bắt đầu',
                  })}
                  type="date"
                  bg={inputBgColor}
                />
                <FormErrorMessage>
                  {errors.startDate?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.endDate} isRequired>
                <FormLabel>Ngày Kết Thúc</FormLabel>
                <Input
                  {...register('endDate', {
                    required: 'Vui lòng chọn ngày kết thúc',
                  })}
                  type="date"
                  bg={inputBgColor}
                />
                <FormErrorMessage>
                  {errors.endDate?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </FormSection>

          {/* Video và Hình Ảnh */}
          <FormSection title="Video và Hình Ảnh" icon={<FiYoutube />}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>URL Video YouTube</FormLabel>
                <InputGroup>
                  <Input
                    {...register('videoUrl', {
                      validate: validateYoutubeUrl,
                    })}
                    placeholder="https://youtube.com/watch?v=..."
                    bg={inputBgColor}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Toggle video preview"
                      icon={
                        showVideoPreview ? <ViewOffIcon /> : <ViewIcon />
                      }
                      variant="ghost"
                      onClick={() =>
                        setShowVideoPreview(!showVideoPreview)
                      }
                    />
                  </InputRightElement>
                </InputGroup>
                {errors.videoUrl && (
                  <FormErrorMessage>
                    {errors.videoUrl?.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>URL Hình Ảnh</FormLabel>
                <Input
                  {...register('imageUrl')}
                  placeholder="https://example.com/image.jpg"
                  bg={inputBgColor}
                />
              </FormControl>
            </SimpleGrid>

            <Collapse
              in={
                showVideoPreview &&
                videoUrl &&
                getYoutubeVideoId(videoUrl)
              }
            >
              <Box mt={4}>
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                      videoUrl
                    )}`}
                    title="YouTube video preview"
                    allowFullScreen
                  />
                </AspectRatio>
              </Box>
            </Collapse>
          </FormSection>

          {/* Danh Sách Công Việc */}
          <FormSection title="Danh Sách Công Việc" icon={<CalendarIcon />}>
            <VStack spacing={4} align="stretch">
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th color={textColor}>Tên Công Việc</Th>
                      <Th color={textColor}>Người Thực Hiện</Th>
                      <Th color={textColor}>Deadline</Th>
                      <Th color={textColor}>Tiến Độ (%)</Th>
                      <Th color={textColor}></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {taskFields.map((field, index) => (
                      <Tr key={field.id}>
                        <Td>
                          <Input
                            {...register(`tasks.${index}.title`, {
                              required: 'Vui lòng nhập tên công việc',
                            })}
                            placeholder="Tên công việc"
                            bg={inputBgColor}
                          />
                          {errors.tasks?.[index]?.title && (
                            <Text color="red.500" fontSize="sm">
                              {errors.tasks[index].title.message}
                            </Text>
                          )}
                        </Td>
                        <Td>
                          <Controller
                            name={`tasks.${index}.assignee`}
                            control={control}
                            render={({ field: selectField }) => (
                              <Select
                                {...selectField}
                                placeholder="Chọn người thực hiện"
                                bg={inputBgColor}
                                isDisabled={isLoadingAssignees}
                              >
                                {isLoadingAssignees ? (
                                  <option value="">Đang tải...</option>
                                ) : (
                                  assignees.map((assignee) => (
                                    <option
                                      key={assignee.id}
                                      value={assignee.id}
                                    >
                                      {assignee.fullName} (
                                      {assignee.email})
                                    </option>
                                  ))
                                )}
                              </Select>
                            )}
                          />
                        </Td>
                        <Td>
                          <Input
                            {...register(`tasks.${index}.deadline`)}
                            type="date"
                            bg={inputBgColor}
                          />
                        </Td>
                        <Td>
                          <Controller
                            name={`tasks.${index}.progress`}
                            control={control}
                            render={({ field: numberField }) => (
                              <NumberInput
                                {...numberField}
                                min={0}
                                max={100}
                                bg={inputBgColor}
                                value={numberField.value || 0}
                                onChange={(value) => {
                                  numberField.onChange(Number(value));
                                  setValue(
                                    'progress',
                                    calculateTotalProgress()
                                  );
                                }}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            )}
                          />
                        </Td>
                        <Td>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => removeTask(index)}
                            aria-label="Xóa công việc"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Button
                leftIcon={<AddIcon />}
                onClick={() =>
                  appendTask({
                    title: '',
                    assignee: '',
                    deadline: '',
                    progress: 0,
                  })
                }
                colorScheme="blue"
                width="full"
              >
                Thêm Công Việc
              </Button>

              <Box mt={4}>
                <FormLabel>Tiến Độ Tổng Thể</FormLabel>
                <Progress
                  value={calculateTotalProgress()}
                  size="lg"
                  colorScheme="blue"
                  hasStripe
                  isAnimated
                  borderRadius="full"
                  mb={2}
                />
                <Badge colorScheme="blue" fontSize="sm">
                  {calculateTotalProgress()}%
                </Badge>
              </Box>
            </VStack>
          </FormSection>

          {/* Đường Dẫn Các Bộ Phận */}
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem border="none">
              <AccordionButton
                bg={inputBgColor}
                borderRadius="md"
                _hover={{ bg: 'gray.600' }}
              >
                <Box flex="1">
                  <Stack direction="row" align="center">
                    <LinkIcon />
                    <Heading size="sm">Đường Dẫn Các Bộ Phận</Heading>
                  </Stack>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Code Repository</FormLabel>
                    <Input
                      {...register('departmentLinks.coding')}
                      placeholder="https://github.com/your-project"
                      bg={inputBgColor}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Thiết Kế 2D</FormLabel>
                    <Input
                      {...register('departmentLinks.design2D')}
                      placeholder="Link thiết kế 2D"
                      bg={inputBgColor}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Thiết Kế 3D</FormLabel>
                    <Input
                      {...register('departmentLinks.design3D')}
                      placeholder="Link thiết kế 3D"
                      bg={inputBgColor}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Sản Xuất Phim</FormLabel>
                    <Input
                      {...register('departmentLinks.filmProduction')}
                      placeholder="Link sản xuất phim"
                      bg={inputBgColor}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Marketing</FormLabel>
                    <Input
                      {...register('departmentLinks.marketing')}
                      placeholder="Link tài liệu marketing"
                      bg={inputBgColor}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Game Design</FormLabel>
                    <Input
                      {...register('departmentLinks.gameDesign')}
                      placeholder="Link game design document"
                      bg={inputBgColor}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Story/Kịch Bản</FormLabel>
                    <Input
                      {...register('departmentLinks.story')}
                      placeholder="Link kịch bản/story"
                      bg={inputBgColor}
                    />
                  </FormControl>
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {/* Các Đường Dẫn Khác */}
          <FormSection
            title="Các Đường Dẫn Khác"
            icon={<ExternalLinkIcon />}
          >
            <VStack spacing={4}>
              {linkFields.map((field, index) => (
                <SimpleGrid
                  key={field.id}
                  columns={{ base: 1, sm: 3 }}
                  spacing={4}
                  width="100%"
                  alignItems="flex-start"
                >
                  <FormControl>
                    <Input
                      {...register(`links.${index}.title`)}
                      placeholder="Tiêu đề đường dẫn"
                      bg={inputBgColor}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      {...register(`links.${index}.url`)}
                      placeholder="https://example.com"
                      bg={inputBgColor}
                    />
                  </FormControl>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeLink(index)}
                    aria-label="Xóa đường dẫn"
                  />
                </SimpleGrid>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={() => appendLink({ title: '', url: '' })}
                colorScheme="blue"
                variant="ghost"
                width="100%"
              >
                Thêm Đường Dẫn Khác
              </Button>
            </VStack>
          </FormSection>

          {/* Các Mốc Thời Gian Quan Trọng */}
          <FormSection
            title="Các Mốc Thời Gian Quan Trọng"
            icon={<CalendarIcon />}
          >
            <VStack spacing={4}>
              {milestoneFields.map((field, index) => (
                <SimpleGrid
                  key={field.id}
                  columns={{ base: 1, sm: 3 }}
                  spacing={4}
                  width="100%"
                  alignItems="flex-start"
                >
                  <FormControl>
                    <Input
                      {...register(`milestones.${index}.date`)}
                      type="date"
                      bg={inputBgColor}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      {...register(`milestones.${index}.title`)}
                      placeholder="Tiêu đề mốc thời gian"
                      bg={inputBgColor}
                    />
                  </FormControl>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeMilestone(index)}
                    aria-label="Xóa mốc thời gian"
                  />
                </SimpleGrid>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={() => appendMilestone({ date: '', title: '' })}
                colorScheme="blue"
                variant="ghost"
                width="100%"
              >
                Thêm Mốc Thời Gian
              </Button>
            </VStack>
          </FormSection>

          {/* Tiến Độ Theo Người Thực Hiện */}
          {watchedTasks.length > 0 && assignees.length > 0 && (
            <FormSection
              title="Tiến Độ Theo Người Thực Hiện"
              icon={<CalendarIcon />}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {assignees.map((assignee) => {
                  const assigneeTasks = watchedTasks.filter(
                    (task) => task.assignee === assignee.id
                  );
                  if (assigneeTasks.length === 0) return null;

                  const assigneeProgress = Math.round(
                    assigneeTasks.reduce(
                      (sum, task) => sum + (Number(task.progress) || 0),
                      0
                    ) / assigneeTasks.length
                  );

                  return (
                    <Box
                      key={assignee.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={borderColor}
                      bg={inputBgColor}
                    >
                      <VStack align="stretch" spacing={2}>
                        <Heading size="sm" color={textColor}>
                          {assignee.fullName}
                        </Heading>
                        <Text fontSize="sm" color="gray.400">
                          {assignee.email}
                        </Text>
                        <Progress
                          value={assigneeProgress}
                          size="sm"
                          colorScheme="blue"
                          hasStripe
                          borderRadius="full"
                        />
                        <Text
                          fontSize="sm"
                          textAlign="right"
                          color={textColor}
                        >
                          {assigneeTasks.length} công việc - {assigneeProgress}%
                        </Text>
                      </VStack>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </FormSection>
          )}

          {/* Form Controls */}
          <Divider my={6} borderColor={borderColor} />

          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            justify="flex-end"
            width="100%"
          >
            <Button
              onClick={onCancel}
              variant="outline"
              isDisabled={isSubmitting}
              size={{ base: 'md', md: 'lg' }}
              width={{ base: '100%', sm: 'auto' }}
              _hover={{
                bg: 'gray.700',
              }}
            >
              Hủy Bỏ
            </Button>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Đang xử lý..."
              leftIcon={<AddIcon />}
              size={{ base: 'md', md: 'lg' }}
              width={{ base: '100%', sm: 'auto' }}
            >
              {initialData ? 'Cập Nhật Dự Án' : 'Tạo Dự Án Mới'}
            </Button>
          </Stack>
        </VStack>
      </Box>
    </Container>
  );
};

ProjectForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    videoUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    status: PropTypes.string,
    progress: PropTypes.number,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        assignee: PropTypes.string,
        deadline: PropTypes.string,
        progress: PropTypes.number,
      })
    ),
    departmentLinks: PropTypes.shape({
      coding: PropTypes.string,
      design2D: PropTypes.string,
      design3D: PropTypes.string,
      filmProduction: PropTypes.string,
      marketing: PropTypes.string,
      gameDesign: PropTypes.string,
      story: PropTypes.string,
    }),
    milestones: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
        title: PropTypes.string,
      })
    ),
    links: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }),
  onCancel: PropTypes.func.isRequired,
  userRole: PropTypes.oneOf(['admin-tong', 'admin-con', 'member']).isRequired,
};

export default ProjectForm;
