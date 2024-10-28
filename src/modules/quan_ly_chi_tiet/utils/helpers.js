// src/modules/quan_ly_chi_tiet/utils/helpers.js
export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };
  
  export const getStatusColor = (status) => {
    switch (status) {
      case 'MOI':
        return 'gray';
      case 'DANG_LAM':
      case 'DANG_CODE':
      case 'DANG_LAM_API':
      case 'DANG_TEST':
        return 'blue';
      case 'CHO_DUYET':
      case 'CHO_REVIEW':
        return 'orange';
      case 'DA_REVIEW':
        return 'purple';
      case 'HOAN_THANH':
        return 'green';
      case 'TAM_DUNG':
        return 'yellow';
      case 'HUY_BO':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  export const tinhThoiGianConLai = (deadline) => {
    if (!deadline) return '';
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
  
    if (diff < 0) {
      return 'Đã quá hạn';
    }
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return 'Hôm nay';
    }
    return `Còn ${days} ngày`;
  };