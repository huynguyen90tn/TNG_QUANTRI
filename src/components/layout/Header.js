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
  "🚀🌟 Tại TNG Company, chúng ta cùng nhau vươn tới đỉnh cao mới mỗi ngày! 💪",
  "🌟🌺 Mỗi thành viên TNG đều là một ngôi sao sáng, hãy tỏa sáng theo cách của bạn! ✨",
  "💪🔥 Sự kiên trì và nỗ lực không ngừng tại TNG sẽ tạo nên những điều phi thường 🌄",
  "✨🎯 Hôm nay, chúng ta làm tốt hơn ngày hôm qua, để ngày mai tự hào hơn 🌈",
  "🌱📈 TNG Company luôn khuyến khích thành viên phát triển và vượt qua giới hạn của mình 🚀",
  "🔥❤️ Đam mê với công việc là chìa khóa dẫn đến thành công tại TNG 💼",
  "🔑🤝 Thành công của TNG bắt đầu từ tinh thần đoàn kết và nỗ lực của từng thành viên 🏆",
  "🌍💙 Chúng ta không chỉ làm việc, mà còn tạo ra giá trị cho cộng đồng 🌿",
  "🎯💡 Tại TNG, không gì là không thể nếu bạn luôn sẵn lòng học hỏi và đổi mới 📚",
  "🛤️🚶‍♂️ Hành trình của TNG được xây dựng từ những bước tiến nhỏ nhưng vững chắc 🌟",
  "🌄🛡️ Khó khăn chỉ là một phần của hành trình, cùng nhau chúng ta sẽ vượt qua tất cả! 🌈",
  "🏆🤩 TNG tin tưởng vào tiềm năng của mỗi thành viên, cùng nhau chinh phục mục tiêu 🎯",
  "💼📅 Mỗi ngày làm việc tại TNG là một cơ hội để phát triển và thăng tiến 🚀",
  "📚🛠️ Không ngừng học hỏi và cải tiến - đó là cách TNG luôn dẫn đầu 🌐",
  "💡💬 Ý tưởng của bạn có thể thay đổi tương lai của TNG, hãy mạnh dạn chia sẻ 🌠",
  "⚙️🔧 Mỗi nhiệm vụ tại TNG đều mang ý nghĩa đặc biệt, hãy hoàn thành với niềm đam mê ❤️",
  "🌻🖌️ TNG luôn khuyến khích sự sáng tạo và đổi mới trong mọi công việc 🛠️",
  "🛡️⚔️ Chúng ta không ngại khó khăn, tại TNG, thử thách chỉ là cơ hội để tỏa sáng 🌟",
  "🚴‍♂️🏋️ Hãy tiến về phía trước, vì mỗi nỗ lực của bạn đều đóng góp vào thành công của TNG 🏆",
  "🏅🎖️ Mỗi thành tích của bạn đều là niềm tự hào của TNG! 🌠",
  "🧗‍♂️🚀 Chinh phục thử thách hôm nay để tạo nên thành công ngày mai tại TNG 🌈",
  "🛠️⚡ Tại TNG, không có công việc nhỏ, chỉ có những nỗ lực lớn lao 💪",
  "🌠🎨 Hãy biến mục tiêu của bạn thành hiện thực cùng TNG 🚀",
  "🌟👏 TNG luôn đánh giá cao tinh thần làm việc chăm chỉ và nhiệt huyết của bạn 🌻",
  "📈🔍 Chúng ta không ngừng phát triển để trở thành phiên bản tốt hơn mỗi ngày 📊",
  "💪🤝 Thành công của TNG được xây dựng từ sự nỗ lực của từng nhân viên 🌅",
  "🔄🌍 Thay đổi là cơ hội - hãy cùng TNG đón nhận và bứt phá 🌐",
  "🧩🏡 TNG là ngôi nhà chung nơi mọi nhân viên cùng nhau hoàn thiện bức tranh thành công 🎨",
  "🎈🛫 Tại TNG, mỗi ngày đều là một cuộc phiêu lưu mới để khám phá tiềm năng của chính bạn 🚀",
  "🏆🎉 Chúng ta là một đội, cùng nhau chúng ta sẽ đạt được những đỉnh cao mới 🌄"
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
              color="#FFD700"
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