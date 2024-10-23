import React, { useState, useCallback } from 'react';
import {
  Box,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Link,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Progress,
  Divider,
  useColorModeValue,
  Tooltip,
  SimpleGrid,
  Center,
  AspectRatio,
  IconButton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  EditIcon, 
  ExternalLinkIcon, 
  CalendarIcon,
  ViewIcon
} from '@chakra-ui/icons';
import { 
  FiCode, 
  FiPenTool, 
  FiBox, 
  FiVideo, 
  FiTarget, 
  FiBook,
  FiYoutube,
  FiMaximize2,
  FiMinimize2
} from 'react-icons/fi';

const MotionBox = motion(Box);

const LinkButton = ({ icon, label, href }) => {
  if (!href) return null;
  
  return (
    <Tooltip label={label}>
      <Link href={href} isExternal>
        <Button
          leftIcon={icon}
          rightIcon={<ExternalLinkIcon />}
          variant="outline"
          width="full"
          size="sm"
        >
          {label}
        </Button>
      </Link>
    </Tooltip>
  );
};

const VideoEmbed = ({ url }) => {
  const getVideoId = useCallback((videoUrl) => {
    if (!videoUrl) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, []);

  const videoId = getVideoId(url);

  if (!videoId) return null;

  return (
    <AspectRatio ratio={16/9}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  );
};

const ProjectCard = ({ project, onEdit, userRole }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const modalBgColor = useColorModeValue('gray.50', 'gray.700');

  if (!project || typeof project !== 'object') {
    return null;
  }

  const {
    id = '',
    name = '',
    description = '',
    imageUrl = '',
    videoUrl = '',
    status = 'đang-chờ',
    progress = 0,
    startDate = '',
    endDate = '',
    departmentLinks = {},
    milestones = [],
    tasks = []
  } = project;

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case 'đang-thực-hiện': return 'blue';
      case 'hoàn-thành': return 'green';
      case 'tạm-dừng': return 'orange';
      default: return 'gray';
    }
  };

  const statusColor = getStatusColor(status);
  const formattedStatus = status?.replace(/-/g, ' ') || 'Chưa có trạng thái';

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit && typeof onEdit === 'function') {
      onEdit(project);
    }
  };

  const toggleVideoExpand = (e) => {
    e.stopPropagation();
    setIsVideoExpanded(!isVideoExpanded);
  };

  return (
    <>
      <MotionBox
        borderWidth="1px"
        borderRadius="xl"
        overflow="hidden"
        bg={bgColor}
        borderColor={borderColor}
        boxShadow="lg"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        cursor="pointer"
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        position="relative"
        height="100%"
      >
        <Box position="relative">
          {videoUrl ? (
            <Box height={isVideoExpanded ? "400px" : "200px"}>
              <VideoEmbed url={videoUrl} />
              <IconButton
                icon={isVideoExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
                position="absolute"
                top={2}
                right={2}
                zIndex={2}
                onClick={toggleVideoExpand}
                aria-label="Toggle video size"
              />
            </Box>
          ) : (
            <Box height="200px" overflow="hidden">
              <Image
                src={imageUrl || '/api/placeholder/400/200'}
                alt={name || 'Project image'}
                width="100%"
                height="100%"
                objectFit="cover"
                transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
                transition="transform 0.3s ease"
                fallback={
                  <Center height="100%" bg="gray.100">
                    <Text>No image</Text>
                  </Center>
                }
              />
            </Box>
          )}
          <Box
            position="absolute"
            top={4}
            right={videoUrl ? 12 : 4}
            zIndex={1}
          >
            <Badge
              colorScheme={statusColor}
              px={3}
              py={1}
              borderRadius="full"
              textTransform="capitalize"
            >
              {formattedStatus}
            </Badge>
          </Box>
        </Box>

        <Box p={6}>
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold" fontSize="xl" noOfLines={1}>
              {name || 'Untitled Project'}
            </Text>
            
            <Text noOfLines={2} color="gray.600">
              {description || 'No description available'}
            </Text>

            <Box w="100%">
              <Text mb={2} fontSize="sm" color="gray.500">
                Tiến độ: {progress || 0}%
              </Text>
              <Progress
                value={progress || 0}
                size="sm"
                colorScheme={statusColor}
                borderRadius="full"
              />
            </Box>

            <HStack width="100%" justify="space-between">
              {videoUrl && (
                <Button
                  leftIcon={<FiYoutube />}
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  as="a"
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Xem trên YouTube
                </Button>
              )}
              
              {(userRole === 'admin-tong' || userRole === 'admin-con') && (
                <IconButton
                  icon={<EditIcon />}
                  onClick={handleEditClick}
                  colorScheme="blue"
                  variant="ghost"
                  size="sm"
                  aria-label="Edit project"
                />
              )}
            </HStack>
          </VStack>
        </Box>
      </MotionBox>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack justify="space-between">
              <Text fontWeight="bold" fontSize="xl">
                {name || 'Untitled Project'}
              </Text>
              <Badge colorScheme={statusColor} px={3} py={1}>
                {formattedStatus}
              </Badge>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>Tổng quan</Tab>
                <Tab>Chi tiết</Tab>
                <Tab>Tiến độ</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    {videoUrl ? (
                      <VideoEmbed url={videoUrl} />
                    ) : (
                      <Image
                        src={imageUrl || '/api/placeholder/400/200'}
                        alt={name || 'Project image'}
                        borderRadius="lg"
                        objectFit="cover"
                        fallback={
                          <Center height="200px" bg="gray.100" borderRadius="lg">
                            <Text>No image</Text>
                          </Center>
                        }
                      />
                    )}

                    <Box>
                      <Text fontWeight="bold" mb={2}>Mô tả dự án</Text>
                      <Text color="gray.600">
                        {description || 'Chưa có mô tả'}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>Thời gian</Text>
                      <HStack>
                        <CalendarIcon />
                        <Text>Bắt đầu: {startDate || 'Chưa có'}</Text>
                        <Text>-</Text>
                        <Text>Kết thúc: {endDate || 'Chưa có'}</Text>
                      </HStack>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={4}>Tiến độ dự án</Text>
                      <Progress
                        value={progress || 0}
                        size="lg"
                        colorScheme={statusColor}
                        borderRadius="full"
                        hasStripe
                      />
                      <Text mt={2} textAlign="center">
                        {progress || 0}% hoàn thành
                      </Text>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    {Object.keys(departmentLinks || {}).length > 0 && (
                      <Box>
                        <Text fontWeight="bold" mb={4}>Liên kết dự án</Text>
                        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                          <LinkButton
                            icon={<FiCode />}
                            label="Source Code"
                            href={departmentLinks.coding}
                          />
                          <LinkButton
                            icon={<FiPenTool />}
                            label="2D Design"
                            href={departmentLinks.design2D}
                          />
                          <LinkButton
                            icon={<FiBox />}
                            label="3D Model"
                            href={departmentLinks.design3D}
                          />
                          <LinkButton
                            icon={<FiVideo />}
                            label="Production"
                            href={departmentLinks.filmProduction}
                          />
                          <LinkButton
                            icon={<FiTarget />}
                            label="Marketing"
                            href={departmentLinks.marketing}
                          />
                          <LinkButton
                            icon={<FiBook />}
                            label="Story"
                            href={departmentLinks.story}
                          />
                        </SimpleGrid>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                <TabPanel>
                  {Array.isArray(milestones) && milestones.length > 0 && (
                    <Box>
                      <Text fontWeight="bold" mb={4}>Các mốc quan trọng</Text>
                      <VStack align="stretch" spacing={3}>
                        {milestones.map((milestone, index) => (
                          <HStack
                            key={index}
                            p={3}
                            bg={modalBgColor}
                            borderRadius="md"
                            justify="space-between"
                          >
                            <Text>{milestone?.title || 'Chưa có tiêu đề'}</Text>
                            <Badge>{milestone?.date || 'Chưa có ngày'}</Badge>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjectCard;