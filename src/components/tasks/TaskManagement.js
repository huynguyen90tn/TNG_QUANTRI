import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
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
  Stack,
  Text,
  SimpleGrid,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useAuth } from "../../hooks/useAuth";
import { getDepartmentUsers } from "../../services/api/userApi";
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

const INITIAL_TASK_STATE = {
  taskId: "",
  title: "",
  description: "",
  department: "",
  deadline: "",
  assignees: [],
  status: "pending",
};

const TaskManagement = ({ projectId }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [taskForm, setTaskForm] = useState(INITIAL_TASK_STATE);

  const bgColor = useColorModeValue("gray.800", "gray.900");
  const borderColor = useColorModeValue("gray.600", "gray.700");
  const inputBgColor = useColorModeValue("gray.700", "gray.800");

  const generateTaskId = useCallback((department) => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const deptCode =
      DEPARTMENTS.find((d) => d.id === department)?.role || "GEN";
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    return `${deptCode}-${year}${month}${day}-${random}`;
  }, []);

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
    if (!selectedDepartment) return;
    try {
      const result = await getDepartmentUsers(selectedDepartment);
      setUsers(result.data);
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
  }, [loadTasks]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    const newTaskId = generateTaskId(department);
    setTaskForm((prev) => ({
      ...prev,
      department,
      taskId: newTaskId,
      assignees: [],
    }));
    setSelectedAssignees([]);
  };

  const handleAssigneeSelect = (e) => {
    const userId = e.target.value;
    const userSelected = users.find((u) => u.id === userId);
    if (!userSelected || selectedAssignees.some((a) => a.id === userId)) return;

    const newAssignee = {
      id: userId,
      name: userSelected.fullName,
      email: userSelected.email,
      progress: 0,
      notes: "",
    };
    setSelectedAssignees((prev) => [...prev, newAssignee]);
    setTaskForm((prev) => ({
      ...prev,
      assignees: [...prev.assignees, newAssignee],
    }));
  };

  const handleAssigneeProgress = (assigneeId, progress) => {
    setSelectedAssignees((prev) =>
      prev.map((a) =>
        a.id === assigneeId ? { ...a, progress: Number(progress) } : a
      )
    );
    setTaskForm((prev) => ({
      ...prev,
      assignees: prev.assignees.map((a) =>
        a.id === assigneeId ? { ...a, progress: Number(progress) } : a
      ),
    }));
  };

  const handleAssigneeNotes = (assigneeId, notes) => {
    setSelectedAssignees((prev) =>
      prev.map((a) => (a.id === assigneeId ? { ...a, notes } : a))
    );
    setTaskForm((prev) => ({
      ...prev,
      assignees: prev.assignees.map((a) =>
        a.id === assigneeId ? { ...a, notes } : a
      ),
    }));
  };

  const handleRemoveAssignee = (assigneeId) => {
    setSelectedAssignees((prev) => prev.filter((a) => a.id !== assigneeId));
    setTaskForm((prev) => ({
      ...prev,
      assignees: prev.assignees.filter((a) => a.id !== assigneeId),
    }));
  };

  const resetForm = () => {
    setTaskForm(INITIAL_TASK_STATE);
    setSelectedAssignees([]);
    setIsEditing(false);
    setCurrentTask(null);
    setSelectedDepartment("");
  };

  const calculateProgress = (assignees) => {
    if (!assignees || assignees.length === 0) return 0;
    const totalProgress = assignees.reduce(
      (sum, a) => sum + (Number(a.progress) || 0),
      0
    );
    return Math.round(totalProgress / assignees.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.department || !taskForm.deadline) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        ...taskForm,
        projectId,
        taskId: taskForm.taskId || generateTaskId(taskForm.department),
      };

      if (isEditing && currentTask) {
        await updateTask(currentTask.id, taskData);
        toast({
          title: "Cập nhật nhiệm vụ thành công",
          status: "success",
          duration: 3000,
        });
      } else {
        await createTask(taskData);
        toast({
          title: "Tạo nhiệm vụ mới thành công",
          status: "success",
          duration: 3000,
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
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setTaskForm({
      ...task,
      deadline: task.deadline.split("T")[0],
    });
    setSelectedAssignees(task.assignees || []);
    setSelectedDepartment(task.department);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?")) return;

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
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="white">
          Quản Lý Nhiệm Vụ
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel color="white">Mã Nhiệm Vụ</FormLabel>
                <Input
                  value={taskForm.taskId}
                  isReadOnly
                  placeholder="Mã sẽ được tạo tự động khi chọn phân hệ"
                  bg={inputBgColor}
                  color="white"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="white">Tiêu Đề Nhiệm Vụ</FormLabel>
                <Input
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Nhập tiêu đề nhiệm vụ"
                  bg={inputBgColor}
                  color="white"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel color="white">Mô Tả</FormLabel>
              <Textarea
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Nhập mô tả nhiệm vụ"
                bg={inputBgColor}
                color="white"
              />
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel color="white">Phân Hệ</FormLabel>
                <Select
                  value={taskForm.department}
                  onChange={handleDepartmentChange}
                  bg={inputBgColor}
                  color="white"
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
                <FormLabel color="white">Thêm Người Thực Hiện</FormLabel>
                <Select
                  onChange={handleAssigneeSelect}
                  placeholder="Chọn người thực hiện"
                  isDisabled={!taskForm.department}
                  bg={inputBgColor}
                  color="white"
                >
                  {users.map((userItem) => (
                    <option key={userItem.id} value={userItem.id}>
                      {userItem.fullName} ({userItem.email})
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="white">Deadline</FormLabel>
                <Input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }))
                  }
                  bg={inputBgColor}
                  color="white"
                />
              </FormControl>
            </SimpleGrid>

            {selectedAssignees.length > 0 && (
              <Box
                width="100%"
                bg={inputBgColor}
                p={4}
                borderRadius="md"
                mt={4}
              >
                <Text color="white" fontWeight="medium" mb={4}>
                  Danh Sách Người Thực Hiện:
                </Text>
                <VStack spacing={4} align="stretch">
                  {selectedAssignees.map((assignee) => (
                    <Box
                      key={assignee.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={borderColor}
                    >
                      <HStack spacing={4} mb={4}>
                        <Tag size="md" colorScheme="blue" borderRadius="full">
                          <TagLabel>{assignee.name}</TagLabel>
                          <TagCloseButton
                            onClick={() => handleRemoveAssignee(assignee.id)}
                          />
                        </Tag>
                        <Text color="white">{assignee.email}</Text>
                      </HStack>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel color="white">Tiến Độ (%)</FormLabel>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={assignee.progress}
                            onChange={(e) =>
                              handleAssigneeProgress(
                                assignee.id,
                                e.target.value
                              )
                            }
                            bg="gray.600"
                            color="white"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel color="white">Ghi Chú</FormLabel>
                          <Input
                            value={assignee.notes}
                            onChange={(e) =>
                              handleAssigneeNotes(assignee.id, e.target.value)
                            }
                            placeholder="Nhập ghi chú"
                            bg="gray.600"
                            color="white"
                          />
                        </FormControl>
                      </SimpleGrid>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            <Stack
              direction="row"
              spacing={4}
              justify="flex-end"
              width="full"
              mt={4}
            >
              <Button
                onClick={resetForm}
                variant="outline"
                isDisabled={isSubmitting}
                color="white"
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
                {isEditing ? "Cập Nhật" : "Thêm Nhiệm Vụ"}
              </Button>
            </Stack>
          </VStack>
        </form>

        <Table variant="simple" mt={8} color="white">
          <Thead>
            <Tr>
              <Th color="gray.300">Mã Nhiệm Vụ</Th>
              <Th color="gray.300">Nhiệm Vụ</Th>
              <Th color="gray.300">Phân Hệ</Th>
              <Th color="gray.300">Người Thực Hiện</Th>
              <Th color="gray.300">Deadline</Th>
              <Th color="gray.300">Tiến Độ</Th>
              <Th color="gray.300">Thao Tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((taskItem) => (
              <Tr key={taskItem.id}>
                <Td>{taskItem.taskId}</Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{taskItem.title}</Text>
                    {taskItem.description && (
                      <Text fontSize="sm" color="gray.400">
                        {taskItem.description}
                      </Text>
                    )}
                  </VStack>
                </Td>
                <Td>
                  <Badge colorScheme="blue">
                    {
                      DEPARTMENTS.find((d) => d.id === taskItem.department)
                        ?.name
                    }
                  </Badge>
                </Td>
                <Td>
                  <VStack align="start" spacing={2}>
                    {taskItem.assignees?.map((assignee) => (
                      <Box key={assignee.id}>
                        <HStack spacing={2}>
                          <Badge colorScheme="green">{assignee.name}</Badge>
                          <Text fontSize="sm">({assignee.progress}%)</Text>
                        </HStack>
                        {assignee.notes && (
                          <Text fontSize="xs" color="gray.400">
                            {assignee.notes}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Td>
                <Td>
                  {new Date(taskItem.deadline).toLocaleDateString("vi-VN")}
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Progress
                      value={calculateProgress(taskItem.assignees)}
                      size="sm"
                      colorScheme="blue"
                      width="100%"
                      borderRadius="full"
                    />
                    <Text fontSize="xs">
                      Trung bình: {calculateProgress(taskItem.assignees)}%
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      onClick={() => handleEdit(taskItem)}
                      aria-label="Sửa nhiệm vụ"
                      size="sm"
                      colorScheme="blue"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(taskItem.id)}
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
      </VStack>
    </Box>
  );
};

TaskManagement.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default TaskManagement;
