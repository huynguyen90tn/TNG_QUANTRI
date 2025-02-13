// TaskListPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  HStack,
  VStack,
  Badge,
  IconButton,
  useToast,
  Input,
  Select,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Progress,
  Text,
  Flex,
  Spacer,
  Tag,
  TagLabel,
  TagCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Tooltip,
  SimpleGrid,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/api/taskApi';
import { getAllUsers } from '../services/api/userApi';
import { getProjects } from '../services/api/projectApi';
import ProjectSelect from '../components/projects/ProjectSelect';


const DEPARTMENTS = [
  { id: 'thien-minh-duong', name: 'Thiên Minh Đường', role: '2D' },
  { id: 'tay-van-cac', name: 'Tây Vân Các', role: '3D' },
  { id: 'hoa-tam-duong', name: 'Họa Tam Đường', role: 'CODE' },
  { id: 'ho-ly-son-trang', name: 'Hồ Ly Sơn trang', role: 'MARKETING' },
  { id: 'hoa-van-cac', name: 'Hoa Vân Các', role: 'FILM' },
  { id: 'tinh-van-cac', name: 'Tinh Vân Các', role: 'GAME_DESIGN' },
];

const STATUS_COLORS = {
  pending: 'yellow',
  'in-progress': 'blue',
  completed: 'green',
  cancelled: 'red',
};

const STATUS_LABELS = {
  pending: 'Chờ xử lý',
  'in-progress': 'Đang thực hiện',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Cao', colorScheme: 'red' },
  { value: 'medium', label: 'Trung bình', colorScheme: 'orange' },
  { value: 'low', label: 'Thấp', colorScheme: 'green' },
];

const INITIAL_FORM_STATE = {
  taskId: '',
  title: '',
  description: '',
  department: '',
  deadline: '',
  assignees: [],
  status: 'pending',
  progress: 0,
  subTasks: [],
  projectId: '',
  priority: 'medium',
  estimatedTime: '',
  dependencies: [],
  comments: [],
  attachments: [],
};

const deepClean = (obj) => {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => deepClean(item))
      .filter((item) => item !== undefined && item !== null);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, deepClean(value)])
    );
  }
  return obj;
};

const TaskListPage = () => {
  const { projectId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    search: '',
    projectId: projectId || '',
    priority: '',
  });
  const [taskForm, setTaskForm] = useState({
    ...INITIAL_FORM_STATE,
    projectId: projectId || '',
  });

  const bgColor = useColorModeValue('white', 'gray.800');

  const generateTaskId = useCallback((department) => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const deptCode = DEPARTMENTS.find((d) => d.id === department)?.role || 'GEN';
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${deptCode}-${year}${month}${day}-${random}`;
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTasks(filters.projectId, filters);
      setTasks(response.data);
    } catch (error) {
      toast({
        title: 'Lỗi tải danh sách nhiệm vụ',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const loadUsers = useCallback(async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'Lỗi tải danh sách người dùng',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const loadProjects = useCallback(async () => {
    try {
      const response = await getProjects();
      setProjects(response.data || []);
    } catch (error) {
      toast({
        title: 'Lỗi tải danh sách dự án',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (projectId) {
      setFilters((prev) => ({
        ...prev,
        projectId,
      }));
      setTaskForm((prev) => ({
        ...prev,
        projectId,
      }));
    }
  }, [projectId]);

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setTaskForm((prev) => ({
      ...prev,
      department,
      taskId: generateTaskId(department),
      assignees: [],
    }));
    setSelectedAssignees([]);
  };

  const handleAssigneeSelect = (e) => {
    const userId = e.target.value;
    const user = users.find((u) => u.id === userId);
    if (!user || selectedAssignees.find((a) => a.id === userId)) return;

    const newAssignee = {
      id: userId,
      name: user.fullName,
      email: user.email,
      progress: 0,
      notes: '',
    };
    setSelectedAssignees((prev) => [...prev, newAssignee]);
    setTaskForm((prev) => ({
      ...prev,
      assignees: [...prev.assignees, newAssignee],
    }));
  };

  const handleAssigneeProgress = (assigneeId, progress) => {
    const updateAssignee = (list) =>
      list.map((a) =>
        a.id === assigneeId ? { ...a, progress: Number(progress) || 0 } : a
      );

    setSelectedAssignees(updateAssignee);
    setTaskForm((prev) => ({
      ...prev,
      assignees: updateAssignee(prev.assignees),
    }));
  };

  const handleAssigneeNotes = (assigneeId, notes) => {
    const updateAssignee = (list) =>
      list.map((a) => (a.id === assigneeId ? { ...a, notes: notes || '' } : a));

    setSelectedAssignees(updateAssignee);
    setTaskForm((prev) => ({
      ...prev,
      assignees: updateAssignee(prev.assignees),
    }));
  };

  const handleRemoveAssignee = (assigneeId) => {
    const filterAssignee = (list) => list.filter((a) => a.id !== assigneeId);

    setSelectedAssignees(filterAssignee);
    setTaskForm((prev) => ({
      ...prev,
      assignees: filterAssignee(prev.assignees),
    }));
  };

  const resetForm = () => {
    setTaskForm({
      ...INITIAL_FORM_STATE,
      projectId: projectId || '',
    });
    setSelectedAssignees([]);
    setSelectedTask(null);
  };

  const calculateOverallProgress = () => {
    const taskAssigneeProgress =
      taskForm.assignees.reduce((sum, a) => sum + (a.progress || 0), 0) /
      (taskForm.assignees.length || 1);

    const subTaskProgress =
      taskForm.subTasks.reduce((sum, subTask) => {
        const subTaskAssigneeProgress =
          subTask.assignees.reduce((subSum, a) => subSum + (a.progress || 0), 0) /
          (subTask.assignees.length || 1);
        return sum + subTaskAssigneeProgress;
      }, 0) / (taskForm.subTasks.length || 1);

    return Math.round((taskAssigneeProgress + subTaskProgress) / 2);
  };

  const handleSubTaskChange = (index, field, value) => {
    const newSubTasks = [...taskForm.subTasks];
    newSubTasks[index] = {
      ...newSubTasks[index],
      [field]: value || '',
    };
    setTaskForm((prev) => ({
      ...prev,
      subTasks: newSubTasks,
    }));
  };

  const handleAddSubTask = () => {
    setTaskForm((prev) => ({
      ...prev,
      subTasks: [
        ...prev.subTasks,
        {
          title: '',
          assignees: [],
          progress: 0,
          notes: '',
          priority: 'medium',
          estimatedTime: '',
          dependencies: [],
          comments: [],
          attachments: [],
        },
      ],
    }));
  };

  const handleRemoveSubTask = (index) => {
    const newSubTasks = [...taskForm.subTasks];
    newSubTasks.splice(index, 1);
    setTaskForm((prev) => ({
      ...prev,
      subTasks: newSubTasks,
    }));
  };

  const handleSubTaskAssigneeSelect = (index, e) => {
    const userId = e.target.value;
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newAssignee = {
      id: userId,
      name: user.fullName,
      email: user.email,
      progress: 0,
      notes: '',
    };

    const newSubTasks = [...taskForm.subTasks];
    const assignees = newSubTasks[index].assignees || [];
    if (assignees.find((a) => a.id === userId)) return;

    newSubTasks[index].assignees = [...assignees, newAssignee];
    setTaskForm((prev) => ({
      ...prev,
      subTasks: newSubTasks,
    }));
  };

  const handleSubTaskAssigneeRemove = (subTaskIndex, assigneeId) => {
    const newSubTasks = [...taskForm.subTasks];
    newSubTasks[subTaskIndex].assignees = newSubTasks[subTaskIndex].assignees.filter(
      (a) => a.id !== assigneeId
    );
    setTaskForm((prev) => ({
      ...prev,
      subTasks: newSubTasks,
    }));
  };

  const handleSubmit = async () => {
    if (!taskForm.title || !taskForm.department || !taskForm.projectId) {
      toast({
        title: 'Vui lòng điền đầy đủ thông tin',
        description: 'Tiêu đề, phân hệ và dự án là bắt buộc',
        status: 'error',
        duration: 3000,
      });
      return;
    }
  
    try {
      setLoading(true);
  
      // Tính toán progress tổng thể
      const overallProgress = calculateOverallProgress();
  
      // Chuẩn bị dữ liệu task
      const taskData = {
        ...taskForm,
        projectId: taskForm.projectId, // Đảm bảo có projectId
        taskId: taskForm.taskId || generateTaskId(taskForm.department),
        progress: overallProgress,
        updatedAt: new Date(), // Cập nhật thời gian
        // Nếu là task mới thì thêm createdAt
        ...(!selectedTask && { createdAt: new Date() })
      };
  
      // Làm sạch dữ liệu trước khi gửi lên Firebase
      const cleanedData = deepClean(taskData);
  
      if (selectedTask) {
        // Cập nhật task hiện có
        await updateTask(selectedTask.id, {
          ...cleanedData,
          id: selectedTask.id // Đảm bảo giữ nguyên ID
        });
      } else {
        // Tạo task mới
        await createTask(cleanedData);
      }
  

      toast({
        title: `${selectedTask ? 'Cập nhật' : 'Tạo'} nhiệm vụ thành công`,
        status: 'success',
        duration: 3000,
      });

      loadTasks();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setTaskForm(task);
    setSelectedAssignees(task.assignees || []);
    onOpen();
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) return;

    try {
      await deleteTask(taskId);
      toast({
        title: 'Xóa nhiệm vụ thành công',
        status: 'success',
        duration: 3000,
      });
      loadTasks();
    } catch (error) {
      toast({
        title: 'Lỗi khi xóa nhiệm vụ',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Box bg={bgColor} p={5} borderRadius="lg" shadow="base">
        {/* Header */}
        <Flex align="center" mb={6}>
          <Heading size="lg">
            {projectId
              ? `Nhiệm Vụ - ${
                  projects.find((p) => p.id === projectId)?.name || 'Dự án'
                }`
              : 'Quản Lý Nhiệm Vụ'}
          </Heading>
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => {
              resetForm();
              onOpen();
            }}
          >
            Thêm Nhiệm Vụ
          </Button>
        </Flex>

        {/* Filters */}
        <HStack mb={6} spacing={4}>
          <FormControl maxW="200px">
            <Input
              placeholder="Tìm kiếm nhiệm vụ..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </FormControl>

          <FormControl maxW="200px">
            <Select
              value={filters.department}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, department: e.target.value }))
              }
              placeholder="Chọn phân hệ"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl maxW="200px">
            <Select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              placeholder="Trạng thái"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl maxW="200px">
            <Select
              value={filters.priority}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priority: e.target.value }))
              }
              placeholder="Độ ưu tiên"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>

          {!projectId && (
            <FormControl maxW="200px">
              <ProjectSelect
                value={filters.projectId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, projectId: e.target.value }))
                }
              />
            </FormControl>
          )}
        </HStack>

        {/* Tasks Table */}
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Mã nhiệm vụ</Th>
                <Th>Tiêu đề</Th>
                <Th>Phân hệ</Th>
                <Th>Độ ưu tiên</Th>
                <Th>Người thực hiện</Th>
                <Th>Deadline</Th>
                <Th>Trạng thái</Th>
                <Th>Tiến độ</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => (
                <Tr key={task.id}>
                  <Td>{task.taskId}</Td>
                  <Td>{task.title}</Td>
                  <Td>
                    <Badge colorScheme="purple">
                      {DEPARTMENTS.find((d) => d.id === task.department)?.name}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        PRIORITY_OPTIONS.find(
                          (p) => p.value === task.priority
                        )?.colorScheme
                      }
                    >
                      {
                        PRIORITY_OPTIONS.find(
                          (p) => p.value === task.priority
                        )?.label
                      }
                    </Badge>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={2}>
                      {task.assignees?.map((assignee) => (
                        <Box key={assignee.id}>
                          <HStack spacing={2}>
                            <Badge colorScheme="green">{assignee.name}</Badge>
                            <Text fontSize="sm">({assignee.progress}%)</Text>
                          </HStack>
                          <Text fontSize="sm">{assignee.email}</Text>
                          {assignee.notes && (
                            <Text fontSize="xs" color="gray.500">
                              {assignee.notes}
                            </Text>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  </Td>
                  <Td>
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString('vi-VN')
                      : ''}
                  </Td>
                  <Td>
                    <Badge colorScheme={STATUS_COLORS[task.status]}>
                      {STATUS_LABELS[task.status]}
                    </Badge>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Progress
                        value={task.progress || 0}
                        size="sm"
                        colorScheme="blue"
                        width="100%"
                      />
                      <Text fontSize="xs">{task.progress || 0}%</Text>
                    </VStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Xem chi tiết">
                        <IconButton
                          icon={<InfoIcon />}
                          onClick={() => handleEdit(task)}
                          aria-label="Chi tiết nhiệm vụ"
                          size="sm"
                          colorScheme="teal"
                        />
                      </Tooltip>
                      <Tooltip label="Chỉnh sửa">
                        <IconButton
                          icon={<EditIcon />}
                          onClick={() => handleEdit(task)}
                          aria-label="Sửa nhiệm vụ"
                          size="sm"
                          colorScheme="blue"
                        />
                      </Tooltip>
                      <Tooltip label="Xóa">
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => handleDelete(task.id)}
                          aria-label="Xóa nhiệm vụ"
                          size="sm"
                          colorScheme="red"
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        {/* Task Modal */}
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedTask ? 'Cập nhật nhiệm vụ' : 'Thêm nhiệm vụ mới'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab>Thông tin nhiệm vụ</Tab>
                  <Tab>Nhiệm vụ con</Tab>
                  <Tab>Bình luận</Tab>
                  <Tab>Tệp đính kèm</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {/* Task Details Form */}
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Dự án</FormLabel>
                        <ProjectSelect
                          value={taskForm.projectId}
                          onChange={(e) =>
                            setTaskForm((prev) => ({
                              ...prev,
                              projectId: e.target.value,
                            }))
                          }
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Mã Nhiệm Vụ</FormLabel>
                        <Input
                          value={taskForm.taskId}
                          isReadOnly
                          placeholder="Mã sẽ được tạo tự động khi chọn phân hệ"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Tiêu đề</FormLabel>
                        <Input
                          value={taskForm.title}
                          onChange={(e) =>
                            setTaskForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Nhập tiêu đề nhiệm vụ"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Mô tả</FormLabel>
                        <Textarea
                          value={taskForm.description}
                          onChange={(e) =>
                            setTaskForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Nhập mô tả nhiệm vụ"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Phân hệ</FormLabel>
                        <Select
                          value={taskForm.department}
                          onChange={handleDepartmentChange}
                          placeholder="Chọn phân hệ"
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Độ ưu tiên</FormLabel>
                        <Select
                          value={taskForm.priority}
                          onChange={(e) =>
                            setTaskForm((prev) => ({
                              ...prev,
                              priority: e.target.value,
                            }))
                          }
                        >
                          {PRIORITY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Thời gian ước tính (giờ)</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          value={taskForm.estimatedTime || ''}
                          onChange={(e) =>
                            setTaskForm((prev) => ({
                              ...prev,
                              estimatedTime: e.target.value,
                            }))
                          }
                          placeholder="Nhập thời gian ước tính"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Thêm Người Thực Hiện</FormLabel>
                        <Select
                          onChange={handleAssigneeSelect}
                          placeholder="Chọn người thực hiện"
                          isDisabled={!taskForm.department}
                        >
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.fullName} - {user.email}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      {selectedAssignees.length > 0 && (
                        <Box width="100%">
                          <Text fontWeight="medium" mb={2}>
                            Danh sách người thực hiện:
                          </Text>
                          <VStack spacing={3} align="stretch">
                            {selectedAssignees.map((assignee) => (
                              <Box
                                key={assignee.id}
                                p={3}
                                borderWidth="1px"
                                borderRadius="md"
                              >
                                <HStack justify="space-between" mb={2}>
                                  <Tag
                                    size="md"
                                    colorScheme="blue"
                                    borderRadius="full"
                                  >
                                    <TagLabel>{assignee.name}</TagLabel>
                                    <TagCloseButton
                                      onClick={() =>
                                        handleRemoveAssignee(assignee.id)
                                      }
                                    />
                                  </Tag>
                                  <Text fontSize="sm">{assignee.email}</Text>
                                </HStack>

                                <SimpleGrid
                                  columns={{ base: 1, md: 2 }}
                                  spacing={4}
                                >
                                  <FormControl>
                                    <FormLabel>Tiến độ (%)</FormLabel>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={assignee.progress || 0}
                                      onChange={(e) =>
                                        handleAssigneeProgress(
                                          assignee.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel>Ghi chú</FormLabel>
                                    <Input
                                      value={assignee.notes || ''}
                                      onChange={(e) =>
                                        handleAssigneeNotes(
                                          assignee.id,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Nhập ghi chú"
                                    />
                                  </FormControl>
                                </SimpleGrid>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      )}

                      <FormControl isRequired>
                        <FormLabel>Deadline</FormLabel>
                        <Input
                          type="date"
                          value={taskForm.deadline || ''}
                          onChange={(e) =>
                            setTaskForm((prev) => ({
                              ...prev,
                              deadline: e.target.value,
                            }))
                          }
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select
                          value={taskForm.status}
                          onChange={(e) =>
                            setTaskForm((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                        >
                          {Object.entries(STATUS_LABELS).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    {/* Nhiệm vụ con */}
                    <Box width="100%" mt={4}>
                      <Text fontWeight="medium" mb={2}>
                        Nhiệm vụ con:
                      </Text>
                      {taskForm.subTasks.map((subTask, index) => (
                        <Box
                          key={index}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          mb={3}
                        >
                          <HStack justify="space-between" mb={2}>
                            <FormControl>
                              <FormLabel>Tiêu đề</FormLabel>
                              <Input
                                value={subTask.title || ''}
                                onChange={(e) =>
                                  handleSubTaskChange(
                                    index,
                                    'title',
                                    e.target.value
                                  )
                                }
                                placeholder="Tiêu đề nhiệm vụ con"
                              />
                            </FormControl>
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleRemoveSubTask(index)}
                              aria-label="Xóa nhiệm vụ con"
                            />
                          </HStack>

                          <FormControl>
                            <FormLabel>Độ ưu tiên</FormLabel>
                            <Select
                              value={subTask.priority || 'medium'}
                              onChange={(e) =>
                                handleSubTaskChange(
                                  index,
                                  'priority',
                                  e.target.value
                                )
                              }
                            >
                              {PRIORITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl>
                            <FormLabel>Thời gian ước tính (giờ)</FormLabel>
                            <Input
                              type="number"
                              min="0"
                              value={subTask.estimatedTime || ''}
                              onChange={(e) =>
                                handleSubTaskChange(
                                  index,
                                  'estimatedTime',
                                  e.target.value
                                )
                              }
                              placeholder="Nhập thời gian ước tính"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Thêm Người Thực Hiện</FormLabel>
                            <Select
                              onChange={(e) =>
                                handleSubTaskAssigneeSelect(index, e)
                              }
                              placeholder="Chọn người thực hiện"
                            >
                              {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.fullName} - {user.email}
                                </option>
                              ))}
                            </Select>
                          </FormControl>

                          {subTask.assignees?.length > 0 && (
                            <Box mt={2}>
                              <Text fontWeight="medium" mb={2}>
                                Danh sách người thực hiện:
                              </Text>
                              <VStack spacing={3} align="stretch">
                                {subTask.assignees.map((assignee) => (
                                  <Box
                                    key={assignee.id}
                                    p={3}
                                    borderWidth="1px"
                                    borderRadius="md"
                                  >
                                    <HStack justify="space-between" mb={2}>
                                      <Tag
                                        size="md"
                                        colorScheme="blue"
                                        borderRadius="full"
                                      >
                                        <TagLabel>{assignee.name}</TagLabel>
                                        <TagCloseButton
                                          onClick={() =>
                                            handleSubTaskAssigneeRemove(
                                              index,
                                              assignee.id
                                            )
                                          }
                                        />
                                      </Tag>
                                      <Text fontSize="sm">{assignee.email}</Text>
                                    </HStack>

                                    <SimpleGrid
                                      columns={{ base: 1, md: 2 }}
                                      spacing={4}
                                    >
                                      <FormControl>
                                        <FormLabel>Tiến độ (%)</FormLabel>
                                        <Input
                                          type="number"
                                          min="0"
                                          max="100"
                                          value={assignee.progress || 0}
                                          onChange={(e) => {
                                            const newAssignees =
                                              subTask.assignees.map((a) =>
                                                a.id === assignee.id
                                                  ? {
                                                      ...a,
                                                      progress: Number(
                                                        e.target.value
                                                      ),
                                                    }
                                                  : a
                                              );
                                            handleSubTaskChange(
                                              index,
                                              'assignees',
                                              newAssignees
                                            );
                                          }}
                                        />
                                      </FormControl>
                                      <FormControl>
                                        <FormLabel>Ghi chú</FormLabel>
                                        <Input
                                          value={assignee.notes || ''}
                                          onChange={(e) => {
                                            const newAssignees =
                                              subTask.assignees.map((a) =>
                                                a.id === assignee.id
                                                  ? {
                                                      ...a,
                                                      notes: e.target.value,
                                                    }
                                                  : a
                                              );
                                            handleSubTaskChange(
                                              index,
                                              'assignees',
                                              newAssignees
                                            );
                                          }}
                                          placeholder="Nhập ghi chú"
                                        />
                                      </FormControl>
                                    </SimpleGrid>
                                  </Box>
                                ))}
                              </VStack>
                            </Box>
                          )}
                        </Box>
                      ))}
                      <Button
                        leftIcon={<AddIcon />}
                        onClick={handleAddSubTask}
                        colorScheme="teal"
                        mt={2}
                      >
                        Thêm Nhiệm Vụ Con
                      </Button>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    {/* Bình luận */}
                    <VStack spacing={4}>
                      <Text>
                        Chức năng bình luận sẽ được triển khai ở đây.
                      </Text>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    {/* Tệp đính kèm */}
                    <VStack spacing={4}>
                      <Text>
                        Chức năng tệp đính kèm sẽ được triển khai ở đây.
                      </Text>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleClose}>
                Hủy
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={loading}
                isDisabled={!taskForm.projectId}
              >
                {selectedTask ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
};

export default TaskListPage;
