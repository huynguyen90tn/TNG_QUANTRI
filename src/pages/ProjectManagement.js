import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  useColorModeValue,
  Flex,
  VStack,
  chakra,
  shouldForwardProp,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
  Center,
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectList from "../components/projects/ProjectList";
import { getProjects, createProject, updateProject } from "../services/api/projectApi";

// Create chakra components with motion
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const WelcomeQuotes = [
  "Không có gì là không thể với một trái tim quyết tâm 💖",
  "Mỗi thất bại đều là một bước tiến tới thành công 🏆",
  "Hãy tin vào chính mình, bạn mạnh mẽ hơn bạn nghĩ 💪",
  "Hôm nay là cơ hội để trở nên tuyệt vời hơn 🌟",
  "Thử thách chính là cơ hội để trưởng thành 🌱",
  "Hành trình ngàn dặm bắt đầu từ một bước chân 👣",
  "Mọi điều tốt đẹp đều bắt đầu từ niềm tin 🌈",
  "Đừng bao giờ từ bỏ ước mơ của bạn, nó đáng giá! 🌠",
  "Đam mê là chìa khóa để vượt qua mọi khó khăn 🔑",
  "Thành công là không từ bỏ, không bỏ cuộc 🚀",
  "Mỗi ngày đều là một cơ hội mới để thay đổi 🌅",
  "Điều gì đến từ trái tim sẽ chạm tới trái tim ❤️",
  "Mạnh mẽ lên, bạn đã làm rất tốt rồi 💯",
  "Hãy sống trọn từng khoảnh khắc của ngày hôm nay ⏳",
  "Thành công không có điểm dừng, chỉ có đường đi ✨",
  "Hãy tạo dựng tương lai của bạn ngay từ bây giờ 🕰️",
  "Khám phá giới hạn của bạn và phá vỡ chúng 💥",
  "Sáng tạo là bước đầu để làm nên kỳ tích 🎨",
  "Chỉ cần kiên trì, bạn sẽ chạm tới vinh quang 🏅",
  "Những giấc mơ lớn cần một trái tim lớn ❤️",
  "Mỗi ngày là một trang mới để viết câu chuyện của bạn 📖",
  "Khó khăn là bàn đạp để ta vươn lên cao hơn 🌄",
  "Để thành công, hãy bắt đầu từ điều nhỏ nhất 🌱",
  "Mọi điều kỳ diệu đều có thể xảy ra nếu bạn tin vào nó ✨",
  "Chỉ có giới hạn mà bạn tự đặt ra cho mình 🏔️",
  "Dám nghĩ lớn, dám thực hiện lớn 🌍",
  "Hạnh phúc nằm ở hành trình, không phải đích đến 🎈",
  "Mỗi ngày là cơ hội để thay đổi cuộc đời bạn 🎉",
  "Hãy là người tạo ra thay đổi bạn muốn thấy 🌐",
  "Giữ niềm tin vào những điều tốt đẹp sẽ đến 🌟",
  "Thành công không chỉ là đích đến, mà là quá trình 🚴",
  "Càng khó khăn, bạn càng mạnh mẽ 🌌",
  "Không có đường tắt đến thành công, chỉ có làm việc chăm chỉ 🔨",
  "Bắt đầu ngày mới với sự tự tin và năng lượng tích cực 🌞",
  "Hãy làm điều bạn yêu và yêu điều bạn làm ❤️",
  "Chấp nhận thử thách, nó sẽ giúp bạn trưởng thành 📈",
  "Vinh quang chỉ đến với những người không bao giờ từ bỏ 🏅",
  "Cuộc sống là những bước đi đầy thử thách, hãy tiếp tục tiến về phía trước 🛤️",
  "Mỗi quyết định của bạn đều tạo nên tương lai 🌅",
  "Điều bạn làm hôm nay sẽ quyết định ngày mai 🌄",
  "Hãy dũng cảm với những giấc mơ của mình 💫",
  "Cứ bước đi, thành công sẽ chờ bạn phía trước 🚶",
  "Hãy luôn tự tin và không ngừng cố gắng 💯",
  "Cuộc sống là một món quà, hãy trân trọng từng phút giây 🎁",
  "Thành công không phải là một sự may mắn, mà là sự kiên trì 📌",
  "Đôi khi, im lặng là cách thể hiện sức mạnh tuyệt vời nhất 🧘",
  "Khám phá và tạo dựng con đường riêng của bạn 🛤️",
  "Đừng chờ đợi cơ hội, hãy tự tạo ra nó 🔨",
  "Mỗi ngày là một chương mới trong cuộc đời bạn 📖",
  "Sự kiên nhẫn là chìa khóa dẫn đến thành công 🗝️",
  "Chỉ cần bạn không ngừng cố gắng, mọi điều đều có thể 🌠",
  "Hãy dũng cảm đối mặt với thử thách, nó sẽ giúp bạn trưởng thành 🌱",
  "Mỗi hành động đều có sức mạnh thay đổi cuộc đời bạn ⚡",
  "Thời gian không chờ đợi ai, hãy hành động ngay bây giờ ⏳",
  "Hãy sống như thể hôm nay là ngày cuối cùng của bạn 🌅",
  "Không có thất bại, chỉ có bài học để trưởng thành 📚",
  "Mọi giấc mơ đều xứng đáng được theo đuổi 💫",
  "Hãy tin vào những điều tốt đẹp sẽ đến với bạn ✨",
  "Dù khó khăn đến đâu, chỉ cần bạn không bỏ cuộc 💪",
  "Mỗi ngày là một cơ hội mới để làm tốt hơn 🌞",
  "Hãy làm hết sức mình, kết quả sẽ không phụ lòng bạn 🌈",
  "Sức mạnh lớn nhất là từ niềm tin vào bản thân 💖",
  "Thành công bắt đầu từ những suy nghĩ tích cực 💭",
  "Mỗi giấc mơ đều xứng đáng được hiện thực hóa 🌠",
  "Đừng bao giờ từ bỏ đam mê, nó sẽ đưa bạn tới đỉnh cao 🚀",
  "Hãy đối diện với mọi thử thách bằng nụ cười 😊",
  "Cơ hội không tự đến, hãy tự tạo nên chúng 🔨",
  "Sự khác biệt làm nên bạn, hãy tỏa sáng 🌟",
  "Mỗi ngày là một cơ hội để trưởng thành và thành công 🌱",
  "Dũng cảm không phải không sợ hãi, mà là vượt qua nó 💪",
  "Đường đến thành công không phải là dễ dàng, nhưng đáng giá 🏆",
  "Chỉ cần bạn có niềm tin, không gì là không thể 🌌",
  "Chỉ có bạn mới quyết định được giới hạn của chính mình 🏔️",
  "Sống hết mình, yêu hết lòng, và tin tưởng tuyệt đối 🌈",
  "Sống chậm lại, nhìn ngắm xung quanh và tận hưởng từng khoảnh khắc 🌅",
  "Hãy luôn nỗ lực, không ngừng hoàn thiện bản thân 📈",
  "Dù đi chậm, nhưng đừng bao giờ dừng lại 🛤️",
  "Mỗi ngày là một cơ hội để viết lên câu chuyện của bạn ✍️",
  "Làm việc chăm chỉ và đam mê sẽ dẫn đến thành công 🏅",
  "Sự kiên trì tạo nên kỳ tích 📌",
  "Hãy hành động vì ước mơ của bạn mỗi ngày 🌠",
  "Hãy là phiên bản tốt nhất của chính mình 🎉",
  "Không có điều gì là dễ dàng, chỉ có bạn không bỏ cuộc 🔥",
  "Hành động ngày hôm nay là thành công của ngày mai 💪",
  "Thành công không phải là điểm đến, mà là cả hành trình 🛤️",
  "Hãy tự tin, kiên trì và quyết tâm đến cùng 🎯",
  "Chỉ cần bạn tin tưởng vào bản thân, không gì là không thể 🌈",
  "Mỗi thử thách là một bước tiến về phía mục tiêu 🧗",
  "Đam mê và kiên trì là con đường đến thành công 🏆",
  "Hãy tạo nên một ngày tuyệt vời với tinh thần lạc quan 🌞",
  "Mọi nỗ lực đều xứng đáng, chỉ cần bạn không bỏ cuộc 🌟",
  "Hãy là ánh sáng trong chính câu chuyện của bạn 🌟",
  "Chẳng có điều gì là giới hạn, trừ khi bạn tự đặt ra nó 🌌",
  "Chỉ cần một bước tiến tới, bạn sẽ gần hơn tới ước mơ 🌠",
  "Hãy luôn nỗ lực và không bao giờ từ bỏ đam mê 💥",
  "Sống với đam mê, bạn sẽ không bao giờ làm việc một ngày nào 🎉",
  "Đừng lo sợ thất bại, nó là một phần của hành trình 🌊",
  "Hãy mạnh mẽ và không ngừng phấn đấu mỗi ngày 🌅",
  "Hành trình của bạn chỉ mới bắt đầu, tiếp tục vươn xa 🚀",
  "Hãy tin rằng điều tốt đẹp sẽ đến với bạn 💖",
];

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);

  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("gray.900", "gray.900");
  const textColor = useColorModeValue("whiteAlpha.900", "whiteAlpha.900");
  const gradientText = "linear(to-r, blue.400, purple.500, pink.500)";

  const modalSize = useBreakpointValue({ base: "full", md: "90vw", lg: "95vw" });

  // Handle quote animation
  useEffect(() => {
    const textTimer = setInterval(() => {
      setIsTextVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % WelcomeQuotes.length);
        setIsTextVisible(true);
      }, 1000);
    }, 5000);

    return () => clearInterval(textTimer);
  }, []);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects();
      setProjects(response || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle project operations
  const handleCreateProject = useCallback(async (projectData) => {
    try {
      setLoading(true);
      await createProject(projectData);
      await fetchProjects();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [fetchProjects, onClose]);

  const handleUpdateProject = useCallback(async (projectData) => {
    try {
      if (!editingProject?.id) return;
      setLoading(true);
      await updateProject(editingProject.id, projectData);
      await fetchProjects();
      setEditingProject(null);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [editingProject, fetchProjects, onClose]);

  const handleEditProject = useCallback((project) => {
    setEditingProject(project);
    onOpen();
  }, [onOpen]);

  const handleCloseModal = useCallback(() => {
    setEditingProject(null);
    onClose();
  }, [onClose]);

  return (
    <Box minH="100vh" bg={bgColor} color={textColor}>
      {/* Welcome Section */}
      <Container maxW="7xl" py={8}>
        <ChakraBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          textAlign="center"
          mb={8}
        >
          <Heading
            fontSize={{ base: "2xl", md: "4xl" }}
            bgGradient={gradientText}
            bgClip="text"
            letterSpacing="wider"
            mb={4}
          >
            Chào mừng {user?.role === "admin-tong" ? "Admin" : "Thành viên"}{" "}
            {user?.displayName || ""}
          </Heading>
        </ChakraBox>

        {/* Logo */}
        <Flex justify="center" align="center" my={6}>
          <ChakraBox
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/images/LOGOTNG.png"
              alt="TNG Logo"
              width={{ base: "120px", md: "150px" }}
              height="auto"
              filter="drop-shadow(0 0 20px rgba(0, 100, 255, 0.3))"
            />
          </ChakraBox>
        </Flex>

        {/* Animated Quotes */}
        <ChakraBox
          animate={{
            opacity: isTextVisible ? 1 : 0,
            y: isTextVisible ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          textAlign="center"
          height="50px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={8}
        >
          <Text
            color="blue.300"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="medium"
          >
            {WelcomeQuotes[currentQuoteIndex]}
          </Text>
        </ChakraBox>

        {/* Decorative Lines */}
        <VStack spacing={4} mb={12}>
          {[1, 2, 3].map((i) => (
            <ChakraBox
              key={i}
              width={`${100 - i * 20}%`}
              height="2px"
              bgGradient="linear(to-r, transparent, blue.500, transparent)"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: i * 0.2 }}
            />
          ))}
        </VStack>

        {/* Projects List */}
        {loading ? (
          <Center>
            <Text>Đang tải...</Text>
          </Center>
        ) : error ? (
          <Center>
            <Text color="red.300">{error}</Text>
          </Center>
        ) : (
          <ProjectList
            projects={projects}
            onEdit={handleEditProject}
            userRole={user?.role}
            onCreateProject={() => {
              setEditingProject(null);
              onOpen();
            }}
          />
        )}
      </Container>

      {/* Project Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size={modalSize}
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg={bgColor} maxW={modalSize}>
          <ModalCloseButton color={textColor} />
          <ModalBody p={6}>
            <ProjectForm
              onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
              initialData={editingProject}
              onCancel={handleCloseModal}
              userRole={user?.role}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProjectManagement;