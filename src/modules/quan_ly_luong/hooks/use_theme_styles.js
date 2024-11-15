// File: src/modules/quan_ly_luong/hooks/use_theme_styles.js

import { useColorModeValue } from '@chakra-ui/react';

export const useThemeStyles = () => {
  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgInput = useColorModeValue('gray.50', 'whiteAlpha.50');
  const bgInputHover = useColorModeValue('gray.100', 'whiteAlpha.100');

  return {
    bgCard,
    borderColor,
    bgInput,
    bgInputHover,
    // Thêm styles cho card thưởng/phạt
    thuongCard: {
      colorScheme: 'green',
      iconColor: '#48BB78',
      hoverBg: 'green.50', 
    },
    phatCard: {
      colorScheme: 'red', 
      iconColor: '#E53E3E',
      hoverBg: 'red.50',
    }
  };
};