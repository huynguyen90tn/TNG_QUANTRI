// File: src/components/layout/Header.js
// Link tham khảo: https://reactrouter.com/web/guides/quick-start
// Nhánh: main

import React, { useCallback, useState, useEffect } from 'react';
import { Box, Flex, IconButton, HStack, Text, Tooltip } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaCrown, 
  FaUserTie, 
  FaUserAstronaut, 
  FaSignOutAlt, 
  FaHome 
} from 'react-icons/fa';

const ROLES = {
  ADMIN_TONG: 'admin_tong',
  ADMIN_CON: 'admin_con', 
  MEMBER: 'member'
};

const QUOTES = [
  "🌟 Hôm nay tôi chọn 🌺 trở thành phiên bản tốt nhất của chính mình",
  "✨ Mỗi ngày là 🌅 một cơ hội mới để tạo nên điều phi thường",
  "🚀 Thành công là hành trình, 🎯 không phải đích đến",
  "🔥 Đam mê là động lực, kỷ luật là 🔑 chìa khóa",
  "💪 Khó khăn là cơ hội 🛠️ để vươn lên mạnh mẽ hơn",
  "🌈 Không gì là không thể 🏆 nếu bạn quyết tâm",
  "🌼 Hãy tin vào bản thân mình, 🍀 mọi thứ sẽ đến đúng lúc",
  "🛤️ Bước đi hôm nay sẽ mang lại 🌠 kết quả cho ngày mai",
  "🔓 Sự kiên trì là chìa khóa mở 🌐 cánh cửa thành công",
  "🌄 Thất bại chỉ là 🚧 bước đệm cho thành công lớn hơn",
  "💫 Hãy mơ lớn, nhưng hành động còn 📈 lớn hơn",
  "📚 Không ngừng học hỏi và 🛠️ cải thiện chính mình",
  "🏅 Chỉ cần bạn không dừng bước, 🏃 bạn sẽ không bao giờ thua",
  "🕰️ Tương lai được tạo nên từ 🛤️ những gì bạn làm hôm nay",
  "🌻 Thái độ tích cực sẽ mang đến 🌞 những điều tốt đẹp",
  "🔨 Đừng chờ đợi cơ hội, hãy 🌱 tạo ra nó",
  "🗺️ Cuộc sống là hành trình khám phá, 🧳 không phải đích đến",
  "🛫 Tự tin là bước đầu tiên 🌟 để biến ước mơ thành hiện thực",
  "🛡️ Sự dũng cảm không phải là không sợ hãi, mà là vượt qua 🌪️ nó",
  "🔥 Hãy sống với đam mê, thành công sẽ theo đuổi bạn 🌠",
  "🌟 Thành công không đến từ may mắn, mà từ 🛠️ sự nỗ lực không ngừng",
  "🎯 Hôm nay bạn làm tốt hơn hôm qua 📅 là đã thành công rồi",
  "🧠 Thay đổi bắt đầu từ chính 💡 suy nghĩ của bạn",
  "📖 Mỗi thất bại đều là 🧩 một bài học quý giá",
  "🏋️ Đừng bao giờ từ bỏ khi bạn còn có thể cố gắng thêm một chút nữa ⏳",
  "🚴‍♂️ Hạnh phúc không phải là 🏁 đích đến mà là hành trình",
  "🌉 Lòng kiên nhẫn là cây cầu nối giữa ước mơ và hiện thực 🌈",
  "🌅 Dù khó khăn đến đâu, chỉ cần bạn không dừng bước, bạn sẽ đến đích 🛤️",
  "🧗 Người duy nhất bạn nên cố gắng vượt qua là chính mình ngày hôm qua 🏔️",
  "🎈 Chỉ cần bạn dám ước mơ, bạn đã đi được 🛫 nửa chặng đường"
];


const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);
const MotionText = motion(Text);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 20000); // Slowed down to 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  }, [logout, navigate]);

  const handleLogoClick = useCallback(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    const role = user.role?.toLowerCase();
    switch (role) {
      case ROLES.ADMIN_TONG:
        navigate('/admin-tong', { replace: true });
        break;
      case ROLES.ADMIN_CON:
        navigate('/admin-con', { replace: true });
        break;
      case ROLES.MEMBER:
        navigate('/member', { replace: true });
        break;
      default:
        navigate('/');
    }
  }, [navigate, user, isAuthenticated]);

  const renderDashboardButtons = useCallback(() => {
    if (!user) return null;
    const role = user.role?.toLowerCase();

    return (
      <HStack spacing={8}>
        <Tooltip label="Trang chủ" placement="bottom" hasArrow>
          <MotionIconButton
            icon={<FaHome size="28px" />}
            aria-label="Trang chủ"
            variant="ghost"
            colorScheme="whiteAlpha"
            size="lg"
            onClick={handleLogoClick}
            whileHover={{
              scale: 1.2,
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.6)',
              background: 'rgba(255, 255, 255, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            _hover={{ bg: 'whiteAlpha.200' }}
            p={4}
          />
        </Tooltip>

        {role === ROLES.ADMIN_TONG && (
          <Tooltip label="Bảng điều khiển Admin Tổng" placement="bottom" hasArrow>
            <MotionIconButton
              icon={<FaCrown size="28px" />}
              aria-label="Admin Tổng Dashboard"
              variant="ghost"
              colorScheme="yellow"
              size="lg"
              onClick={() => navigate('/admin-tong')}
              whileHover={{
                scale: 1.2,
                boxShadow: '0 0 30px rgba(236, 201, 75, 0.6)',
                background: 'rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
              _hover={{ bg: 'whiteAlpha.200' }}
              p={4}
            />
          </Tooltip>
        )}

        {role === ROLES.ADMIN_CON && (
          <Tooltip label="Bảng điều khiển Admin Con" placement="bottom" hasArrow>
            <MotionIconButton
              icon={<FaUserTie size="28px" />}
              aria-label="Admin Con Dashboard"
              variant="ghost"
              colorScheme="cyan"
              size="lg"
              onClick={() => navigate('/admin-con')}
              whileHover={{
                scale: 1.2,
                boxShadow: '0 0 30px rgba(103, 178, 223, 0.6)',
                background: 'rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
              _hover={{ bg: 'whiteAlpha.200' }}
              p={4}
            />
          </Tooltip>
        )}

        {role === ROLES.MEMBER && (
          <Tooltip label="Bảng điều khiển Thành viên" placement="bottom" hasArrow>
            <MotionIconButton
              icon={<FaUserAstronaut size="28px" />}
              aria-label="Member Dashboard"
              variant="ghost"
              colorScheme="green"
              size="lg"
              onClick={() => navigate('/member')}
              whileHover={{
                scale: 1.2,
                boxShadow: '0 0 30px rgba(72, 187, 120, 0.6)',
                background: 'rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
              _hover={{ bg: 'whiteAlpha.200' }}
              p={4}
            />
          </Tooltip>
        )}

        <Tooltip label="Đăng xuất" placement="bottom" hasArrow>
          <MotionIconButton
            icon={<FaSignOutAlt size="28px" />}
            aria-label="Đăng xuất"
            variant="ghost"
            colorScheme="red"
            onClick={handleLogout}
            whileHover={{
              scale: 1.2,
              boxShadow: '0 0 30px rgba(245, 101, 101, 0.6)',
              background: 'rgba(255, 255, 255, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            _hover={{ bg: 'whiteAlpha.200' }}
            p={4}
          />
        </Tooltip>
      </HStack>
    );
  }, [user, navigate, handleLogout, handleLogoClick]);

  return (
    <MotionBox
      bg="#2B6CB0"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.3)"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
    >
      <Flex 
        direction="column" 
        maxW="1400px" 
        mx="auto" 
        px={8} 
        py={4}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <MotionText
            fontSize="3xl"
            fontWeight="bold"
            color="white"
            cursor="pointer"
            onClick={handleLogoClick}
            whileHover={{ scale: 1.02 }}
            animate={{
              textShadow: ["0 0 10px #fff", "0 0 30px #fff", "0 0 10px #fff"],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            letterSpacing="wide"
          >
            TNG Company Management
          </MotionText>
          {isAuthenticated && renderDashboardButtons()}
        </Flex>

        {isAuthenticated && (
          <Box 
            overflow="hidden" 
            mt={6}
            pt={4}
            borderTop="1px solid rgba(255, 255, 255, 0.1)"
          >
            <MotionText
              initial={{ x: "100%" }}
              animate={{ 
                x: "-100%",
                transition: {
                  duration: 20,
                  ease: "linear",
                  repeat: Infinity
                }
              }}
              color="white"
              fontSize="2xl"
              fontWeight="medium"
              whiteSpace="nowrap"
              textShadow="0 0 10px rgba(255, 255, 255, 0.5)"
              style={{ display: "inline-block" }}
            >
              {QUOTES[quoteIndex]}
            </MotionText>
          </Box>
        )}
      </Flex>
    </MotionBox>
  );
};

export default Header;