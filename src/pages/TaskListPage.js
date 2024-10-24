// src/pages/TaskListPage.js
import React, { useState, useEffect, useCallback } from "react";
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
  Badge,
  IconButton,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  VStack,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
} from "@chakra-ui/icons";
import { useAuth } from "../hooks/useAuth";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/api/taskApi";
import { getUserList } from "../services/api/userApi";

const DEPARTMENTS = [
  { id: "thien-minh-duong", name: "Thiên Minh Đường", role: "2D" },
  { id: "tay-van-cac", name: "Tây Vân Các", role: "3D" },
  { id: "hoa-tam-duong", name: "Họa Tam Đường", role: "CODE" },
  { id: "ho-ly-son-trang", name: "Hồ Ly Sơn trang", role: "MARKETING" },
  { id: "hoa-van-cac", name: "Hoa Vân Các", role: "FILM" },
  { id: "tinh-van-cac", name: "Tinh Vân Các", role: "GAME_DESIGN" },
];

const TaskListPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    search: "",
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignee: "",
    department: "",
    deadline: "",
    progress: 0,
    status: "pending",
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTasks(null, filters);
      setTasks(response.data);
    } catch (error) {
      toast({
        title: "Lỗi tải danh sách nhiệm vụ",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const loadUsers = useCallback(async () => {
    try {
      const response = await getUserList({});
      setUsers(response.data);
    } catch (error) {
      toast({
        title: "Lỗi tải danh sách người dùng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, [loadTasks, loadUsers]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selectedTask) {
        await updateTask(selectedTask.id, taskForm);
        toast({
          title: "Cập nhật nhiệm vụ thành công",
          status: "success",
          duration: 3000,
        });
      } else {
        await createTask(taskForm);
        toast({
          title: "Tạo nhiệm vụ thành công",
          status: "success",
          duration: 3000,
        });
      }
      loadTasks();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      department: task.department,
      deadline: task.deadline,
      progress: task.progress,
      status: task.status,
    });
    onOpen();
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?")) {
      try {
        await deleteTask(taskId);
        toast({
          title: "Xóa nhiệm vụ thành công",
          status: "success",
          duration: 3000,
        });
        loadTasks();
      } catch (error) {
        toast({
          title: "Lỗi khi xóa nhiệm vụ",
          description: error.message,
          status: "error",
          duration: 3000,
        });
      }
    }
  };

  const resetForm = () => {
    setTaskForm({
      title: "",
      description: "",
      assignee: "",
      department: "",
      deadline: "",
      progress: 0,
      status: "pending",
    });
    setSelectedTask(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "yellow",
      "in-progress": "blue",
      completed: "green",
      cancelled: "red",
    };
    return colors[status] || "gray";
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Box bg={bgColor} p={5} borderRadius="lg" shadow="base">
        <Flex align="center" mb={6}>
          <Heading size="lg">Quản Lý Nhiệm Vụ</Heading>
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

        <HStack mb={6} spacing={4}>
          <FormControl maxW="200px">
            <Input
              placeholder="Tìm kiếm nhiệm vụ..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </FormControl>

          <FormControl maxW="200px">
            <Select
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
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
                setFilters({ ...filters, status: e.target.value })
              }
              placeholder="Trạng thái"
            >
              <option value="pending">Chờ xử lý</option>
              <option value="in-progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </Select>
          </FormControl>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nhiệm vụ</Th>
              <Th>Phân hệ</Th>
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
                <Td>{task.title}</Td>
                <Td>
                  <Badge>
                    {DEPARTMENTS.find((d) => d.id === task.department)?.name ||
                      task.department}
                  </Badge>
                </Td>
                <Td>
                  {users.find((u) => u.id === task.assignee)?.fullName ||
                    task.assignee}
                </Td>
                <Td>{new Date(task.deadline).toLocaleDateString("vi-VN")}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(task.status)}>
                    {task.status === "pending" && "Chờ xử lý"}
                    {task.status === "in-progress" && "Đang thực hiện"}
                    {task.status === "completed" && "Hoàn thành"}
                    {task.status === "cancelled" && "Đã hủy"}
                  </Badge>
                </Td>
                <Td>
                  <Progress
                    value={task.progress}
                    size="sm"
                    colorScheme="blue"
                  />
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      onClick={() => handleEdit(task)}
                      aria-label="Sửa nhiệm vụ"
                      size="sm"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(task.id)}
                      aria-label="Xóa nhiệm vụ"
                      size="sm"
                      colorScheme="red"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedTask ? "Cập nhật nhiệm vụ" : "Thêm nhiệm vụ mới"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tiêu đề</FormLabel>
                  <Input
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Mô tả</FormLabel>
                  <Textarea
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phân hệ</FormLabel>
                  <Select
                    value={taskForm.department}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, department: e.target.value })
                    }
                  >
                    <option value="">Chọn phân hệ</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Người thực hiện</FormLabel>
                  <Select
                    value={taskForm.assignee}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, assignee: e.target.value })
                    }
                  >
                    <option value="">Chọn người thực hiện</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Deadline</FormLabel>
                  <Input
                    type="date"
                    value={taskForm.deadline}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, deadline: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Tiến độ (%)</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={taskForm.progress}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        progress: Number(e.target.value),
                      })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    value={taskForm.status}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, status: e.target.value })
                    }
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="in-progress">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Hủy
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={loading}
              >
                {selectedTask ? "Cập nhật" : "Thêm mới"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
};

export default TaskListPage;
