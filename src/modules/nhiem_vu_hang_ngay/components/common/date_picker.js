// File: src/modules/nhiem_vu_hang_ngay/components/date_picker.js
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const DatePicker = ({ value, onChange, type = 'date' }) => (
  <MotionBox
    as="input"
    type={type}
    value={value}
    onChange={onChange}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
    sx={{
      padding: '0.75rem',
      borderRadius: '0.5rem',
      width: '100%',
      cursor: 'pointer',
      border: '2px solid',
      borderColor: 'gray.200',
      backgroundColor: 'white',
      transition: 'all 0.2s ease-in-out',
      '&::-webkit-calendar-picker-indicator': {
        cursor: 'pointer',
        opacity: 0.7,
        transition: 'opacity 0.2s ease-in-out',
        '&:hover': {
          opacity: 1
        }
      },
      '&::-webkit-datetime-edit': {
        display: 'none'
      },
      '&::-webkit-date-and-time-value': {
        textAlign: 'left'
      },
      _hover: {
        borderColor: 'blue.400',
        transform: 'translateY(-1px)',
        boxShadow: 'md'
      },
      _focus: {
        borderColor: 'blue.500',
        boxShadow: '0 0 0 2px var(--chakra-colors-blue-500)',
        outline: 'none'
      }
    }}
  />
);

export default DatePicker;