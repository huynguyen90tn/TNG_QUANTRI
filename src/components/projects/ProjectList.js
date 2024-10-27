import React, { useState, useMemo } from "react";
import {
  Container,
  SimpleGrid,
  Heading,
  Text,
  Box,
  Center,
  HStack,
  VStack,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  useColorModeValue,
  Icon,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useBreakpointValue,
  Input,
  Select,
  Button,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Tooltip,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock,
  FiPlay,
  FiCheckCircle,
  FiTrendingUp,
  FiActivity,
  FiSearch,
  FiFilter,
  FiPlus,
  FiRefreshCcw,
  FiChevronDown,
} from "react-icons/fi";
import { RiRocketFill, RiFireFill } from "react-icons/ri";
import ProjectCard from "./ProjectCard";

const MotionBox = motion(Box);
const MotionGrid = motion(SimpleGrid);

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "not-started", label: "Chưa thực hiện" },
  { value: "in-progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
];

const DEPARTMENT_OPTIONS = [
  { value: "all", label: "Tất cả phân hệ" },
  { value: "2d", label: "Thiên Minh Đường" },
  { value: "3d", label: "Tây Vân Các" },
  { value: "code", label: "Họa Tam Đường" },
  { value: "marketing", label: "Hồ Ly Sơn trang" },
  { value: "film", label: "Hoa Vân Các" },
  { value: "game-design", label: "Tinh Vân Các" },
];

const FilterTag = ({ label, onRemove }) => (
  <Tag
    size="md"
    borderRadius="full"
    variant="subtle"
    colorScheme="blue"
  >
    <TagLabel>{label}</TagLabel>
    <TagCloseButton onClick={onRemove} />
  </Tag>
);

const StatusBadge = ({ status, count }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "not-started":
        return {
          icon: FiClock,
          color: "gray",
          label: "Chưa thực hiện",
        };
      case "in-progress":
        return {
          icon: FiPlay,
          color: "blue",
          label: "Đang thực hiện",
        };
      case "completed":
        return {
          icon: FiCheckCircle,
          color: "green",
          label: "Hoàn thành",
        };
      default:
        return {
          icon: FiActivity,
          color: "gray",
          label: "Không xác định",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      display="flex"
      alignItems="center"
      px={3}
      py={1}
      borderRadius="full"
      colorScheme={config.color}
      variant="subtle"
    >
      <Icon as={config.icon} mr={2} />
      {config.label} ({count})
    </Badge>
  );
};

const ProjectList = ({ projects = [], onEdit, userRole, onCreateProject }) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    department: "all",
  });
  
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const statBgColor = useColorModeValue("blue.50", "blue.900");
  const filterBgColor = useColorModeValue("gray.50", "gray.700");
  
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      department: "all",
    });
    setShowCompleted(false);
  };

  const projectStats = useMemo(() => {
    if (!Array.isArray(projects)) return { notStarted: 0, inProgress: 0, completed: 0 };

    return projects.reduce(
      (acc, project) => {
        if (!project?.progress) acc.notStarted++;
        else if (project.progress === 100) acc.completed++;
        else acc.inProgress++;
        return acc;
      },
      { notStarted: 0, inProgress: 0, completed: 0 }
    );
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    
    return projects
      .filter((project) => {
        if (!project || typeof project !== "object" || !project.id) return false;
        
        // Search filter
        if (filters.search && !project.name?.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }

        // Status filter
        if (filters.status !== "all") {
          if (filters.status === "completed" && project.progress !== 100) return false;
          if (filters.status === "in-progress" && (project.progress === 0 || project.progress === 100)) return false;
          if (filters.status === "not-started" && project.progress > 0) return false;
        }

        // Department filter
        if (filters.department !== "all" && project.department !== filters.department) {
          return false;
        }

        // Completed projects filter
        if (!showCompleted && project.progress === 100) return false;

        return true;
      });
  }, [projects, filters, showCompleted]);

  const activeFiltersCount = Object.values(filters).filter(
    value => value && value !== "all"
  ).length + (showCompleted ? 1 : 0);

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} width="100%">
        {/* Header Section */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          width="100%"
        >
          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={4}
          >
            <Flex align="center" gap={4}>
              <Icon
                as={RiRocketFill}
                w={8}
                h={8}
                color={headingColor}
              />
              <Heading
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="bold"
                color={headingColor}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Danh Sách Dự Án
              </Heading>
            </Flex>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onCreateProject}
              size="lg"
            >
              Tạo Dự Án Mới
            </Button>
          </Flex>
        </MotionBox>

        {/* Stats Section */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          width="100%"
        >
          <StatGroup
            bg={statBgColor}
            p={6}
            borderRadius="xl"
            boxShadow="xl"
            textAlign="center"
            display="flex"
            flexWrap="wrap"
            justifyContent="space-around"
          >
            <Stat>
              <StatLabel display="flex" alignItems="center" justifyContent="center">
                <Icon as={FiClock} mr={2} />
                Chưa thực hiện
              </StatLabel>
              <StatNumber>{projectStats.notStarted}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel display="flex" alignItems="center" justifyContent="center">
                <Icon as={FiTrendingUp} mr={2} />
                Đang thực hiện
              </StatLabel>
              <StatNumber>{projectStats.inProgress}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel display="flex" alignItems="center" justifyContent="center">
                <Icon as={FiCheckCircle} mr={2} />
                Hoàn thành
              </StatLabel>
              <StatNumber>{projectStats.completed}</StatNumber>
            </Stat>
          </StatGroup>
        </MotionBox>

        {/* Advanced Filters Section */}
        <Box
          width="100%"
          bg={filterBgColor}
          p={4}
          borderRadius="xl"
          boxShadow="sm"
        >
          <VStack spacing={4} width="100%">
            <Flex
              width="100%"
              gap={4}
              flexWrap="wrap"
            >
              <InputGroup maxW={{ base: "100%", md: "300px" }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Tìm kiếm dự án..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </InputGroup>

              <Select
                maxW={{ base: "100%", md: "200px" }}
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              <Select
                maxW={{ base: "100%", md: "200px" }}
                value={filters.department}
                onChange={(e) => handleFilterChange("department", e.target.value)}
              >
                {DEPARTMENT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              <FormControl display="flex" alignItems="center" width="auto">
                <FormLabel htmlFor="show-completed" mb="0" mr={3}>
                  Hiện dự án hoàn thành
                </FormLabel>
                <Switch
                  id="show-completed"
                  isChecked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  colorScheme="green"
                />
              </FormControl>

              {activeFiltersCount > 0 && (
                <Tooltip label="Đặt lại bộ lọc">
                  <Button
                    leftIcon={<FiRefreshCcw />}
                    variant="ghost"
                    onClick={resetFilters}
                  >
                    Đặt lại ({activeFiltersCount})
                  </Button>
                </Tooltip>
              )}
            </Flex>

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <Wrap spacing={2}>
                {filters.search && (
                  <WrapItem>
                    <FilterTag
                      label={`Tìm kiếm: ${filters.search}`}
                      onRemove={() => handleFilterChange("search", "")}
                    />
                  </WrapItem>
                )}
                {filters.status !== "all" && (
                  <WrapItem>
                    <FilterTag
                      label={`Trạng thái: ${STATUS_OPTIONS.find(o => o.value === filters.status)?.label}`}
                      onRemove={() => handleFilterChange("status", "all")}
                    />
                  </WrapItem>
                )}
                {filters.department !== "all" && (
                  <WrapItem>
                    <FilterTag
                      label={`Phân hệ: ${DEPARTMENT_OPTIONS.find(o => o.value === filters.department)?.label}`}
                      onRemove={() => handleFilterChange("department", "all")}
                    />
                  </WrapItem>
                )}
                {showCompleted && (
                  <WrapItem>
                    <FilterTag
                      label="Hiển thị dự án hoàn thành"
                      onRemove={() => setShowCompleted(false)}
                    />
                  </WrapItem>
                )}
              </Wrap>
            )}
          </VStack>
        </Box>

        {/* Projects Grid */}
<AnimatePresence mode="wait">
  {filteredProjects.length === 0 ? (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      py={10}
      textAlign="center"
    >
      <Icon as={RiFireFill} w={10} h={10} color="gray.400" mb={4} />
      <Text fontSize="xl" color={textColor}>
        Không tìm thấy dự án nào phù hợp với điều kiện lọc
      </Text>
      {activeFiltersCount > 0 && (
        <Button
          leftIcon={<FiRefreshCcw />}
          colorScheme="blue"
          variant="outline"
          mt={4}
          onClick={resetFilters}
        >
          Đặt lại bộ lọc
        </Button>
      )}
    </MotionBox>
  ) : (
    <MotionGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={8}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      width="100%"
    >
      {filteredProjects.map((project) => (
        <MotionBox
          key={project.id}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 100,
              },
            },
          }}
          whileHover={{
            y: -5,
            transition: {
              type: "spring",
              stiffness: 300,
            },
          }}
        >
          <ProjectCard
            project={project}
            onEdit={onEdit}
            userRole={userRole}
          />
        </MotionBox>
      ))}
    </MotionGrid>
  )}
</AnimatePresence>
      </VStack>
    </Container>
  );
};

export default ProjectList;