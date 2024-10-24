import React, { useState } from "react";
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
  useColorModeValue,
  SimpleGrid,
  Center,
  AspectRatio,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Grid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { EditIcon, ExternalLinkIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  FiCode,
  FiPenTool,
  FiBox,
  FiVideo,
  FiTarget,
  FiBook,
  FiYoutube,
  FiMaximize2,
  FiMinimize2,
  FiLink,
} from "react-icons/fi";

const MotionBox = motion(Box);

// Link component with improved visibility
const ProjectLink = ({ icon, label, href, colorScheme = "blue" }) => {
  if (!href) return null;

  return (
    <Link
      href={href}
      isExternal
      width="full"
      _hover={{ textDecoration: "none" }}
    >
      <Button
        leftIcon={icon}
        rightIcon={<ExternalLinkIcon />}
        variant="outline"
        colorScheme={colorScheme}
        size="md"
        width="full"
        justifyContent="flex-start"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {label}
      </Button>
    </Link>
  );
};

// Department links section
const DepartmentLinks = ({ links, bgColor }) => (
  <Grid
    templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
    gap={4}
    bg={bgColor}
    p={4}
    borderRadius="lg"
  >
    <ProjectLink
      icon={<FiCode />}
      label="Source Code"
      href={links.coding}
      colorScheme="cyan"
    />
    <ProjectLink
      icon={<FiPenTool />}
      label="2D Design"
      href={links.design2D}
      colorScheme="pink"
    />
    <ProjectLink
      icon={<FiBox />}
      label="3D Model"
      href={links.design3D}
      colorScheme="purple"
    />
    <ProjectLink
      icon={<FiVideo />}
      label="Production"
      href={links.filmProduction}
      colorScheme="red"
    />
    <ProjectLink
      icon={<FiTarget />}
      label="Marketing"
      href={links.marketing}
      colorScheme="green"
    />
    <ProjectLink
      icon={<FiBook />}
      label="Story/Script"
      href={links.story}
      colorScheme="yellow"
    />
    {links.gameDesign && (
      <ProjectLink
        icon={<FiTarget />}
        label="Game Design"
        href={links.gameDesign}
        colorScheme="orange"
      />
    )}
  </Grid>
);

const getVideoId = (videoUrl) => {
  if (!videoUrl) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = videoUrl.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const VideoEmbed = ({ url }) => {
  const videoId = getVideoId(url);
  if (!videoId) return null;

  return (
    <AspectRatio ratio={16 / 9}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "Chưa xác định";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Helper function to calculate remaining time
const calculateRemainingTime = (endDate) => {
  if (!endDate) return "Chưa xác định";

  const end = new Date(endDate);
  const now = new Date();
  const diff = end - now;

  if (diff < 0) return "Đã kết thúc";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days} ngày`;
};

const getStatusColor = (currentStatus) => {
  switch (currentStatus) {
    case "đang-thực-hiện":
      return "blue";
    case "hoàn-thành":
      return "green";
    case "tạm-dừng":
      return "orange";
    default:
      return "gray";
  }
};

const ProjectCard = ({ project, onEdit, userRole }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);

  // Dark mode colors
  const bgColor = useColorModeValue("gray.800", "gray.900");
  const borderColor = useColorModeValue("gray.700", "gray.600");
  const textColor = useColorModeValue("gray.100", "gray.200");
  const modalBgColor = useColorModeValue("gray.700", "gray.800");
  const cardBgColor = useColorModeValue("gray.800", "gray.700");

  if (!project || typeof project !== "object") return null;

  const {
    name = "",
    description = "",
    imageUrl = "",
    videoUrl = "",
    status = "đang-chờ",
    progress = 0,
    startDate = "",
    endDate = "",
    departmentLinks = {},
    milestones = [],
    links = [],
  } = project;

  const statusColor = getStatusColor(status);
  const formattedStatus = status?.replace(/-/g, " ") || "Chưa có trạng thái";

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(project);
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
        bg={cardBgColor}
        borderColor={borderColor}
        boxShadow="dark-lg"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        cursor="pointer"
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        position="relative"
        height="100%"
      >
        {/* Card Media Section */}
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
                src={imageUrl || "/api/placeholder/400/200"}
                alt={name}
                width="100%"
                height="100%"
                objectFit="cover"
                transform={isHovered ? "scale(1.05)" : "scale(1)"}
                transition="transform 0.3s ease"
                fallback={
                  <Center height="100%" bg={bgColor}>
                    <Text color={textColor}>No image</Text>
                  </Center>
                }
              />
            </Box>
          )}

          {/* Status Badge */}
          <Badge
            position="absolute"
            top={4}
            right={videoUrl ? 12 : 4}
            colorScheme={statusColor}
            px={3}
            py={1}
            borderRadius="full"
            textTransform="capitalize"
          >
            {formattedStatus}
          </Badge>
        </Box>

        {/* Card Content */}
        <Box p={6}>
          <VStack align="stretch" spacing={4}>
            <Text
              fontWeight="bold"
              fontSize="xl"
              noOfLines={1}
              color={textColor}
            >
              {name || "Untitled Project"}
            </Text>

            <Text noOfLines={2} color={textColor} opacity={0.8}>
              {description || "No description available"}
            </Text>

            {/* Progress Bar */}
            <Box w="100%">
              <Text mb={2} fontSize="sm" color={textColor} opacity={0.8}>
                Tiến độ: {progress || 0}%
              </Text>
              <Progress
                value={progress || 0}
                size="sm"
                colorScheme={statusColor}
                borderRadius="full"
                bgColor={borderColor}
              />
            </Box>

            {/* Card Actions */}
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

              {(userRole === "admin-tong" || userRole === "admin-con") && (
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

      {/* Detailed Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={modalBgColor} color={textColor}>
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            <HStack justify="space-between">
              <Text fontWeight="bold" fontSize="xl">
                {name || "Untitled Project"}
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
                <Tab>Liên kết</Tab>
                <Tab>Chi tiết</Tab>
              </TabList>
              <TabPanels>
                {/* Overview Panel */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    {videoUrl ? (
                      <VideoEmbed url={videoUrl} />
                    ) : (
                      <Image
                        src={imageUrl || "/api/placeholder/400/200"}
                        alt={name}
                        borderRadius="lg"
                        objectFit="cover"
                        fallback={
                          <Center height="200px" bg={bgColor} borderRadius="lg">
                            <Text color={textColor}>No image</Text>
                          </Center>
                        }
                      />
                    )}

                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Mô tả dự án
                      </Text>
                      <Text color={textColor} opacity={0.8}>
                        {description || "Chưa có mô tả"}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Thời gian
                      </Text>
                      <HStack spacing={4}>
                        <CalendarIcon />
                        <Text>Bắt đầu: {formatDate(startDate)}</Text>
                        <Text>-</Text>
                        <Text>Kết thúc: {formatDate(endDate)}</Text>
                      </HStack>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={4}>
                        Tiến độ dự án
                      </Text>
                      <Progress
                        value={progress || 0}
                        size="lg"
                        colorScheme={statusColor}
                        borderRadius="full"
                        hasStripe
                        isAnimated
                        bg={borderColor}
                      />
                      <Text mt={2} textAlign="center">
                        {progress || 0}% hoàn thành
                      </Text>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Links Panel */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text fontWeight="bold" mb={4}>
                        Liên kết bộ phận
                      </Text>
                      <DepartmentLinks
                        links={departmentLinks}
                        bgColor={bgColor}
                      />
                    </Box>

                    {Array.isArray(links) && links.length > 0 && (
                      <Box>
                        <Text fontWeight="bold" mb={4}>
                          Liên kết khác
                        </Text>
                        <SimpleGrid columns={1} spacing={3}>
                          {links.map((link, index) => (
                            <ProjectLink
                              key={index}
                              icon={<FiLink />}
                              label={link.title}
                              href={link.url}
                              colorScheme="gray"
                            />
                          ))}
                        </SimpleGrid>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                {/* Details Panel */}
                <TabPanel>
                  {Array.isArray(milestones) && milestones.length > 0 && (
                    <Box>
                      <Text fontWeight="bold" mb={4}>
                        Các mốc quan trọng
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        {milestones.map((milestone, index) => (
                          <HStack
                            key={index}
                            p={4}
                            bg={bgColor}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                            justify="space-between"
                            _hover={{
                              bg: modalBgColor,
                            }}
                            transition="all 0.2s"
                          >
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium" color={textColor}>
                                {milestone?.title || "Chưa có tiêu đề"}
                              </Text>
                              <Text
                                fontSize="sm"
                                color={textColor}
                                opacity={0.8}
                              >
                                {milestone?.description || "Không có mô tả"}
                              </Text>
                            </VStack>
                            <Badge
                              colorScheme={statusColor}
                              p={2}
                              borderRadius="md"
                            >
                              {formatDate(milestone?.date) || "Chưa có ngày"}
                            </Badge>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {/* Additional Project Details */}
                  <VStack spacing={6} mt={6} align="stretch">
                    {/* Project Info */}
                    <Box>
                      <Text fontWeight="bold" mb={4}>
                        Thông tin chi tiết
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box
                          p={4}
                          bg={bgColor}
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <Text fontWeight="medium" mb={2}>
                            Trạng thái triển khai
                          </Text>
                          <Badge colorScheme={statusColor}>
                            {formattedStatus}
                          </Badge>
                        </Box>

                        <Box
                          p={4}
                          bg={bgColor}
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <Text fontWeight="medium" mb={2}>
                            Tiến độ dự án
                          </Text>
                          <Progress
                            value={progress || 0}
                            size="sm"
                            colorScheme={statusColor}
                            borderRadius="full"
                            bg={borderColor}
                          />
                          <Text fontSize="sm" mt={2} textAlign="right">
                            {progress || 0}% hoàn thành
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    {/* Project Timeline */}
                    <Box>
                      <Text fontWeight="bold" mb={4}>
                        Timeline dự án
                      </Text>
                      <VStack
                        spacing={4}
                        p={4}
                        bg={bgColor}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between" width="100%">
                          <Text>Ngày bắt đầu:</Text>
                          <Badge>{formatDate(startDate)}</Badge>
                        </HStack>
                        <HStack justify="space-between" width="100%">
                          <Text>Ngày kết thúc (dự kiến):</Text>
                          <Badge>{formatDate(endDate)}</Badge>
                        </HStack>
                        <HStack justify="space-between" width="100%">
                          <Text>Thời gian còn lại:</Text>
                          <Badge colorScheme={statusColor}>
                            {calculateRemainingTime(endDate)}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Box>

                    {/* Department Involvement */}
                    <Box>
                      <Text fontWeight="bold" mb={4}>
                        Bộ phận tham gia
                      </Text>
                      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                        {Object.entries(departmentLinks).map(
                          ([key, value]) =>
                            value && (
                              <Box
                                key={key}
                                p={3}
                                bg={bgColor}
                                borderRadius="md"
                                borderWidth="1px"
                                borderColor={borderColor}
                                textAlign="center"
                              >
                                <Text
                                  fontSize="sm"
                                  fontWeight="medium"
                                  textTransform="capitalize"
                                >
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </Text>
                              </Box>
                            ),
                        )}
                      </SimpleGrid>
                    </Box>
                  </VStack>
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
