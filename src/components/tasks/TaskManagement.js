// src/components/tasks/TaskManagement.js
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  IconButton,
  Textarea,
  Progress,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useAuth } from "../../hooks/useAuth";
import {
  getAllUsers,
  getDepartmentUsers,
  getUserList,
} from "../../services/api/userApi";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from "../../services/api/taskApi";

const DEPARTMENTS = [
  { id: "thien-minh-duong", name: "Thiên Minh Đường", role: "2D" },
  { id: "tay-van-cac", name: "Tây Vân Các", role: "3D" },
  { id: "hoa-tam-duong", name: "Họa Tam Đường", role: "CODE" },
  { id: "ho-ly-son-trang", name: "Hồ Ly Sơn trang", role: "MARKETING" },
  { id: "hoa-van-cac", name: "Hoa Vân Các", role: "FILM" },
  { id: "tinh-van-cac", name: "Tinh Vân Các", role: "GAME_DESIGN" },
];

const TaskManagement = ({ projectId }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgColor = useColorModeValue("gray.800", "gray.900");
  const borderColor = useColorModeValue("gray.600", "gray.700");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    department: "",
    deadline: "",
    progress: 0,
    status: "pending",
  });

  const loadTasks = useCallback(async () => {
    try {
      const result = await getTasks(projectId);
      setTasks(result.data);
    } catch (error) {
      toast({
        title: "Lỗi khi tải danh sách nhiệm vụ",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [projectId, toast]);

  const loadUsers = useCallback(async () => {
    try {
      if (selectedDepartment) {
        const result = await getDepartmentUsers(selectedDepartment);
        setUsers(result.data);
      } else {
        const result = await getAllUsers();
        setUsers(result.data);
      }
    } catch (error) {
      toast({
        title: "Lỗi khi tải danh sách người dùng",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [selectedDepartment, toast]);

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, [loadTasks, loadUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing && currentTask) {
        await updateTask(currentTask.id, { ...formData, projectId });
        toast({
          title: "Cập nhật nhiệm vụ thành công",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createTask({ ...formData, projectId });
        toast({
          title: "Tạo nhiệm vụ mới thành công",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      resetForm();
      loadTasks();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      department: task.department,
      deadline: task.deadline,
      progress: task.progress,
      status: task.status,
    });
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?")) {
      try {
        await deleteTask(taskId);
        toast({
          title: "Xóa nhiệm vụ thành công",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        loadTasks();
      } catch (error) {
        toast({
          title: "Lỗi khi xóa nhiệm vụ",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      assignee: "",
      department: "",
      deadline: "",
      progress: 0,
      status: "pending",
    });
    setIsEditing(false);
    setCurrentTask(null);
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    setFormData((prev) => ({
      ...prev,
      department,
      assignee: "",
    }));
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Heading size="lg" mb={6}>
        Quản Lý Nhiệm Vụ
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Tiêu đề nhiệm vụ</FormLabel>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Nhập tiêu đề nhiệm vụ"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Mô tả</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả nhiệm vụ"
            />
          </FormControl>

          <Stack direction={["column", "row"]} spacing={4}>
            <FormControl isRequired>
              <FormLabel>Phân Hệ</FormLabel>
              <Select
                value={formData.department}
                onChange={handleDepartmentChange}
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
                value={formData.assignee}
                onChange={(e) =>
                  setFormData({ ...formData, assignee: e.target.value })
                }
                isDisabled={!formData.department}
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
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={4} justify="flex-end">
            <Button
              onClick={resetForm}
              variant="outline"
              isDisabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              leftIcon={<AddIcon />}
              isLoading={isSubmitting}
              loadingText="Đang xử lý..."
            >
              {isEditing ? "Cập nhật" : "Thêm nhiệm vụ"}
            </Button>
          </Stack>
        </Stack>
      </form>

      <Table variant="simple" mt={8}>
        <Thead>
          <Tr>
            <Th>Nhiệm vụ</Th>
            <Th>Phân hệ</Th>
            <Th>Người thực hiện</Th>
            <Th>Deadline</Th>
            <Th>Tiến độ</Th>
            <Th>Thao tác</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <Tr key={task.id}>
              <Td>{task.title}</Td>
              <Td>
                <Badge colorScheme="blue">
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
                <Progress value={task.progress} size="sm" colorScheme="blue" />
              </Td>
              <Td>
                <Stack direction="row" spacing={2}>
                  <IconButton
                    icon={<EditIcon />}
                    onClick={() => handleEdit(task)}
                    aria-label="Sửa"
                    size="sm"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(task.id)}
                    aria-label="Xóa"
                    size="sm"
                    colorScheme="red"
                  />
                </Stack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

TaskManagement.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default TaskManagement;
