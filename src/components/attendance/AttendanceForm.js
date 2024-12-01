import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";

const DEPARTMENTS = [
  "Thiên Minh Đường",
  "Tây Vân Các",
  "Họa Tam Đường",
  "Hồ Ly Sơn trang",
  "Hoa Vân Các",
  "Tinh Vân Các",
];

const GREETINGS = [
  "Chúc bạn một ngày làm việc hiệu quả! ✨",
  "Hãy tỏa sáng hôm nay nhé! 🌟",
  "Chúc bạn một ngày tràn đầy năng lượng! 🎉",
];

const WORKING_HOURS = {
  MORNING: {
    START: { hour: 9, minute: 5 },
    END: { hour: 12, minute: 0 },
  },
  AFTERNOON: {
    START: { hour: 13, minute: 0 },
    END: { hour: 18, minute: 0 },
  },
};

function AttendanceForm({ onClose }) {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    memberCode: user?.memberCode || "",
    workLocation: "",
    department: user?.department || "",
    lateReason: "",
    hasReported: "no",
    reportedToAdmin: "",
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const fetchAdmins = useCallback(async () => {
    try {
      const adminsQuery = query(
        collection(db, "users"),
        where("role", "in", ["admin-tong", "admin-con"]),
      );
      const snapshot = await getDocs(adminsQuery);
      const adminsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdmins(adminsList);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách quản lý",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const getCurrentShift = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();

    // Nếu thời gian sau 18:00, vẫn tính là ca chiều để tính toàn bộ thời gian muộn
    if (currentHour >= WORKING_HOURS.AFTERNOON.END.hour) {
      return "AFTERNOON";
    }
    // Nếu thời gian trước 12:00 hoặc trong giờ nghỉ trưa
    if (currentHour < WORKING_HOURS.AFTERNOON.START.hour) {
      return "MORNING";
    }
    return "AFTERNOON";
  }, []);

  const isLate = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentShift = getCurrentShift();

    // Luôn đi muộn nếu điểm danh sau giờ làm việc (18:00)
    if (currentHour >= WORKING_HOURS.AFTERNOON.END.hour) {
      return true;
    }

    if (currentShift === "MORNING") {
      return currentHour > WORKING_HOURS.MORNING.START.hour || 
             (currentHour === WORKING_HOURS.MORNING.START.hour && currentMinute > WORKING_HOURS.MORNING.START.minute);
    }

    // Nếu là ca chiều, luôn tính là đi muộn vì đã bỏ lỡ ca sáng
    return true;
  }, [getCurrentShift]);

  const calculateLateDuration = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Nếu điểm danh sau giờ làm việc (18:00)
    if (currentHour >= WORKING_HOURS.AFTERNOON.END.hour) {
      // Tính tổng thời gian của cả ngày làm việc
      const morningMinutes = (WORKING_HOURS.MORNING.END.hour - WORKING_HOURS.MORNING.START.hour) * 60 + 
                            (WORKING_HOURS.MORNING.END.minute - WORKING_HOURS.MORNING.START.minute);
      const afternoonMinutes = (WORKING_HOURS.AFTERNOON.END.hour - WORKING_HOURS.AFTERNOON.START.hour) * 60;
      const totalLateMinutes = morningMinutes + afternoonMinutes;

      return {
        hours: Math.floor(totalLateMinutes / 60),
        minutes: totalLateMinutes % 60,
      };
    }

    const currentShift = getCurrentShift();
    
    if (currentShift === "MORNING") {
      const lateMinutes = (currentHour - WORKING_HOURS.MORNING.START.hour) * 60 + 
                         (currentMinute - WORKING_HOURS.MORNING.START.minute);
      return {
        hours: Math.floor(lateMinutes / 60),
        minutes: lateMinutes % 60,
      };
    }

    // Nếu là ca chiều, tính tổng thời gian muộn bao gồm cả ca sáng
    if (currentShift === "AFTERNOON") {
      const morningMinutes = (WORKING_HOURS.MORNING.END.hour - WORKING_HOURS.MORNING.START.hour) * 60 + 
                            (WORKING_HOURS.MORNING.END.minute - WORKING_HOURS.MORNING.START.minute);
      const afternoonMinutes = (currentHour - WORKING_HOURS.AFTERNOON.START.hour) * 60 + 
                              (currentMinute - WORKING_HOURS.AFTERNOON.START.minute);
      const totalLateMinutes = morningMinutes + afternoonMinutes;

      return {
        hours: Math.floor(totalLateMinutes / 60),
        minutes: totalLateMinutes % 60,
      };
    }

    return { hours: 0, minutes: 0 };
  }, [getCurrentShift]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.fullName ||
        !formData.memberCode ||
        !formData.workLocation ||
        !formData.department
      ) {
        throw new Error("Vui lòng điền đầy đủ thông tin!");
      }

      const late = isLate();
      if (late && !formData.lateReason) {
        throw new Error("Vui lòng nhập lý do đi muộn!");
      }

      const currentShift = getCurrentShift();
      const { hours, minutes } = calculateLateDuration();
      const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];

      const reportedAdmin = formData.hasReported === "yes" && formData.reportedToAdmin
        ? admins.find((admin) => admin.id === formData.reportedToAdmin)
        : null;

      const attendanceData = {
        userId: user?.id || "",
        fullName: formData.fullName,
        memberCode: formData.memberCode,
        department: formData.department,
        workLocation: formData.workLocation,
        checkInTime: Timestamp.now(),
        shift: currentShift,
        isLate: late,
        lateHours: hours,
        lateMinutes: minutes,
        lateReason: late ? formData.lateReason : "",
        hasReported: formData.hasReported === "yes",
        reportedTo: reportedAdmin ? {
          adminId: reportedAdmin.id,
          adminName: reportedAdmin.fullName,
          adminEmail: reportedAdmin.email,
          reportTime: Timestamp.now()
        } : null,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "attendance"), attendanceData);

      toast({
        title: "Điểm danh thành công!",
        description: late
          ? `Bạn đi muộn ${hours > 0 ? `${hours}h` : ""}${minutes}p. ${greeting}`
          : `Chúc mừng bạn đã đến đúng giờ! ${greeting}`,
        status: late ? "warning" : "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Lỗi điểm danh:", error);
      toast({
        title: "Lỗi!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Họ và tên</FormLabel>
          <Input
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            placeholder="Nhập họ và tên"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Mã số thành viên</FormLabel>
          <Input
            value={formData.memberCode}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, memberCode: e.target.value }))
            }
            placeholder="Nhập mã số thành viên"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Địa điểm làm việc</FormLabel>
          <Select
            value={formData.workLocation}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, workLocation: e.target.value }))
            }
            placeholder="Chọn địa điểm"
          >
            <option value="online">Online</option>
            <option value="office">Tại tổng đàn</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Bộ phận</FormLabel>
          <Select
            value={formData.department}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, department: e.target.value }))
            }
            placeholder="Chọn bộ phận"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </Select>
        </FormControl>

        {isLate() && (
          <>
            <FormControl isRequired>
              <FormLabel>Lý do đi muộn</FormLabel>
              <Textarea
                value={formData.lateReason}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lateReason: e.target.value,
                  }))
                }
                placeholder="Nhập lý do đi muộn..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Đã báo cáo với quản lý?</FormLabel>
              <RadioGroup
                value={formData.hasReported}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, hasReported: value }))
                }
              >
                <Stack direction="row">
                  <Radio value="yes">Đã báo cáo</Radio>
                  <Radio value="no">Chưa báo cáo</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {formData.hasReported === "yes" && (
              <FormControl isRequired>
                <FormLabel>Đã báo cáo với</FormLabel>
                <Select
                  value={formData.reportedToAdmin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reportedToAdmin: e.target.value,
                    }))
                  }
                  placeholder="Chọn quản lý"
                >
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.fullName}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={loading}
          loadingText="Đang xử lý..."
        >
          Điểm danh
        </Button>
      </VStack>
    </Box>
  );
}

export default AttendanceForm;