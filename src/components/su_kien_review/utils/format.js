// File: src/components/su_kien_review/utils/format.js

export const formatDateTime = (date, time) => {
    try {
      if (!date || !time) return '';
      const dateTime = new Date(`${date}T${time}`);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(dateTime);
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return '';
    }
  };
  
  export const formatDate = (date) => {
    try {
      if (!date) return '';
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(date));
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  export const formatTime = (time) => {
    try {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };