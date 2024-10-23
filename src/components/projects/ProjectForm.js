import React, { useState, useEffect, useCallback } from 'react';
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
  Text,
  useColorModeValue,
  AspectRatio,
  InputGroup,
  InputRightElement,
  Collapse,
  useBreakpointValue,
  Stack,
  Container,
  Divider,
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';
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

const ProjectForm = ({ onSubmit, initialData, onCancel, userRole }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  // Responsive values
  const spacing = useBreakpointValue({ base: 4, md: 6 });
  const padding = useBreakpointValue({ base: 3, md: 6 });
  const columns = useBreakpointValue({ base: 1, md: 2 });
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      imageUrl: '',
      videoUrl: '',
      milestones: [],
      links: [],
      departmentLinks: {
        coding: '',
        design2D: '',
        design3D: '',
        filmProduction: '',
        marketing: '',
        gameDesign: '',
        story: ''
      },
      progress: 0,
      status: 'đang-chờ',
      tasks: []
    }
  });

  const { fields: milestoneFields, append: appendMilestone, remove: removeMilestone } = useFieldArray({
    control,
    name: 'milestones'
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control,
    name: 'links'
  });

  const { fields: taskFields, append: appendTask, remove: removeTask } = useFieldArray({
    control,
    name: 'tasks'
  });

  const watchVideoUrl = watch('videoUrl');

  const getYoutubeVideoId = useCallback((url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, []);

  const onFormSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      if (data.videoUrl) {
        const videoId = getYoutubeVideoId(data.videoUrl);
        if (!videoId) {
          toast({
            title: 'Lỗi',
            description: 'URL YouTube không hợp lệ',
            status: 'error',
            duration: 3000,
            isClosable: true
          });
          return;
        }
      }

      await onSubmit(data);
      if (!initialData) {
        reset();
      }
      
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom section components
  const FormSection = ({ title, icon, children }) => (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={padding}
    >
      <Stack direction="row" align="center" mb={4}>
        {icon}
        <Heading size="sm">{title}</Heading>
      </Stack>
      {children}
    </Box>
  );

  return (
    <Container maxW="full" p={0}>
      <Box
        as="form"
        onSubmit={handleSubmit(onFormSubmit)}
        bg={bgColor}
        p={padding}
        borderRadius="lg"
        width="100%"
        mx="auto"
        position="relative"
        height="auto"
        overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.300',
            borderRadius: '24px',
          },
        }}
      >
        <VStack spacing={spacing} align="stretch">
          <Heading size="lg" color={headingColor}>
            {initialData ? 'Cập Nhật Dự Án' : 'Tạo Dự Án Mới'}
          </Heading>

          {/* Basic Information */}
          <SimpleGrid columns={columns} spacing={spacing}>
            <FormControl isInvalid={errors.name} isRequired>
              <FormLabel>Tên Dự Án</FormLabel>
              <Input
                {...register('name', {
                  required: 'Vui lòng nhập tên dự án',
                  minLength: {
                    value: 3,
                    message: 'Tên dự án phải có ít nhất 3 ký tự'
                  }
                })}
                placeholder="Nhập tên dự án"
              />
              <FormErrorMessage>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.description}>
              <FormLabel>Mô Tả</FormLabel>
              <Textarea
                {...register('description')}
                placeholder="Nhập mô tả dự án"
                rows={3}
              />
              <FormErrorMessage>
                {errors.description?.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* Media Section */}
          <FormSection title="Video và Hình Ảnh" icon={<FiYoutube />}>
            <SimpleGrid columns={columns} spacing={spacing}>
              <FormControl>
                <FormLabel>URL Video YouTube</FormLabel>
                <InputGroup>
                  <Input
                    {...register('videoUrl')}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Toggle video preview"
                      icon={showVideoPreview ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShowVideoPreview(!showVideoPreview)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>URL Hình Ảnh</FormLabel>
                <Input
                  {...register('imageUrl')}
                  placeholder="https://example.com/image.jpg"
                />
              </FormControl>
            </SimpleGrid>

            <Collapse in={showVideoPreview && watchVideoUrl && getYoutubeVideoId(watchVideoUrl)}>
              <Box mt={4}>
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(watchVideoUrl)}`}
                    title="YouTube video preview"
                    allowFullScreen
                  />
                </AspectRatio>
              </Box>
            </Collapse>
          </FormSection>

          {/* Project Timeline */}
          <FormSection title="Thời Gian Dự Án" icon={<CalendarIcon />}>
            <SimpleGrid columns={columns} spacing={spacing}>
              <FormControl isInvalid={errors.startDate} isRequired>
                <FormLabel>Ngày Bắt Đầu</FormLabel>
                <Input
                  {...register('startDate', {
                    required: 'Vui lòng chọn ngày bắt đầu'
                  })}
                  type="date"
                />
                <FormErrorMessage>
                  {errors.startDate?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.endDate} isRequired>
                <FormLabel>Ngày Kết Thúc (Dự Kiến)</FormLabel>
                <Input
                  {...register('endDate', {
                    required: 'Vui lòng chọn ngày kết thúc'
                  })}
                  type="date"
                />
                <FormErrorMessage>
                  {errors.endDate?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </FormSection>

          {/* Department Links */}
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem border="none">
              <AccordionButton px={0}>
                <Box flex="1">
                  <Stack direction="row" align="center">
                    <LinkIcon />
                    <Heading size="sm">Đường Dẫn Các Bộ Phận</Heading>
                  </Stack>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} px={0}>
                <SimpleGrid columns={columns} spacing={spacing}>
                  <FormControl>
                    <FormLabel>Code Repository</FormLabel>
                    <Input
                      {...register('departmentLinks.coding')}
                      placeholder="https://github.com/your-project"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Thiết Kế 2D</FormLabel>
                    <Input
                      {...register('departmentLinks.design2D')}
                      placeholder="Link thiết kế 2D"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Thiết Kế 3D</FormLabel>
                    <Input
                      {...register('departmentLinks.design3D')}
                      placeholder="Link thiết kế 3D"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Sản Xuất Phim</FormLabel>
                    <Input
                      {...register('departmentLinks.filmProduction')}
                      placeholder="Link sản xuất phim"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Marketing</FormLabel>
                    <Input
                      {...register('departmentLinks.marketing')}
                      placeholder="Link tài liệu marketing"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Game Design</FormLabel>
                    <Input
                      {...register('departmentLinks.gameDesign')}
                      placeholder="Link game design document"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Story/Kịch Bản</FormLabel>
                    <Input
                      {...register('departmentLinks.story')}
                      placeholder="Link kịch bản/story"
                    />
                  </FormControl>
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {/* Other Links */}
          <FormSection title="Các Đường Dẫn Khác" icon={<ExternalLinkIcon />}>
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
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      {...register(`links.${index}.url`)}
                      placeholder="https://example.com"
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

          {/* Milestones */}
          <FormSection title="Các Mốc Thời Gian Quan Trọng" icon={<CalendarIcon />}>
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
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      {...register(`milestones.${index}.title`)}
                      placeholder="Tiêu đề mốc thời gian"
                    />
                  </FormControl>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeMilestone(index)}
                    aria-label="Xóa mốc thời gian"
                    alignSelf={{ base: 'stretch', sm: 'flex-start' }}
                    width={{ base: 'full', sm: 'auto' }}
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

          {/* Tasks Section */}
          <FormSection title="Danh Sách Công Việc" icon={<CalendarIcon />}>
            <VStack spacing={4}>
              {taskFields.map((field, index) => (
                <SimpleGrid 
                  key={field.id} 
                  columns={{ base: 1, md: 4 }} 
                  spacing={4} 
                  width="100%"
                  alignItems="flex-start"
                >
                  <FormControl>
                    <Input
                      {...register(`tasks.${index}.title`)}
                      placeholder="Tên công việc"
                    />
                  </FormControl>
                  <FormControl>
                    <Select 
                      {...register(`tasks.${index}.assignee`)}
                      placeholder="Chọn người thực hiện"
                    >
                      <option value="member1">Thành viên 1</option>
                      <option value="member2">Thành viên 2</option>
                      <option value="member3">Thành viên 3</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <Input
                      {...register(`tasks.${index}.deadline`)}
                      type="date"
                      placeholder="Hạn hoàn thành"
                    />
                  </FormControl>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeTask(index)}
                    aria-label="Xóa công việc"
                    alignSelf={{ base: 'stretch', md: 'flex-start' }}
                    width={{ base: 'full', md: 'auto' }}
                  />
                </SimpleGrid>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={() => appendTask({ 
                  title: '', 
                  assignee: '', 
                  deadline: '' 
                })}
                colorScheme="blue"
                variant="ghost"
                width="100%"
              >
                Thêm Công Việc
              </Button>
            </VStack>
          </FormSection>

          {/* Status & Progress Section (Admin Only) */}
          {(userRole === 'admin-tong' || userRole === 'admin-con') && (
            <FormSection title="Trạng Thái & Tiến Độ" icon={<CalendarIcon />}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={spacing}>
                <FormControl isInvalid={errors.status}>
                  <FormLabel>Trạng Thái</FormLabel>
                  <Select 
                    {...register('status')}
                    defaultValue="đang-chờ"
                  >
                    <option value="đang-chờ">Đang Chờ</option>
                    <option value="đang-thực-hiện">Đang Thực Hiện</option>
                    <option value="hoàn-thành">Hoàn Thành</option>
                    <option value="tạm-dừng">Tạm Dừng</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.status?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.progress}>
                  <FormLabel>Tiến Độ (%)</FormLabel>
                  <Input
                    {...register('progress', {
                      valueAsNumber: true,
                      min: { value: 0, message: 'Tiến độ không thể âm' },
                      max: { value: 100, message: 'Tiến độ không thể vượt quá 100%' }
                    })}
                    type="number"
                    placeholder="0"
                  />
                  <Progress
                    value={parseInt(watch('progress') || 0)}
                    size="sm"
                    mt={2}
                    colorScheme="blue"
                    borderRadius="full"
                  />
                  <FormErrorMessage>
                    {errors.progress?.message}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            </FormSection>
          )}

          {/* Form Controls */}
          <Divider my={4} />
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            justify="flex-end"
            pt={4}
            width="100%"
          >
            <Button
              onClick={onCancel}
              variant="outline"
              isDisabled={isSubmitting}
              size={buttonSize}
              width={{ base: '100%', sm: 'auto' }}
            >
              Hủy Bỏ
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Đang xử lý..."
              leftIcon={<AddIcon />}
              size={buttonSize}
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

export default ProjectForm;