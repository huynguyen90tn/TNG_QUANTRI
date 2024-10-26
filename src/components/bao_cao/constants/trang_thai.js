 // src/components/bao_cao/constants/trang_thai.js
export const TRANG_THAI_BAO_CAO = {
    cho_duyet: {
      id: 'cho_duyet',
      label: 'Chờ duyệt',
      color: 'yellow',
      icon: '🕒'
    },
    da_duyet: {
      id: 'da_duyet', 
      label: 'Đã duyệt',
      color: 'green',
      icon: '✓'
    },
    tu_choi: {
      id: 'tu_choi',
      label: 'Từ chối',
      color: 'red', 
      icon: '✕'
    },
    cap_nhat: {
      id: 'cap_nhat',
      label: 'Đang cập nhật',
      color: 'blue',
      icon: '✎'
    }
  };
  
  // src/components/bao_cao/constants/loai_bao_cao.js
  export const LOAI_BAO_CAO = [
    {
      id: 'bao-cao-du-an',
      label: 'Báo cáo dự án',
      icon: '📊',
      description: 'Báo cáo tiến độ và tình hình dự án'
    },
    {
      id: 'bao-cao-cong-viec', 
      label: 'Báo cáo công việc',
      icon: '📝',
      description: 'Báo cáo công việc cá nhân hàng ngày'
    },
    {
      id: 'bao-cao-van-de',
      label: 'Báo cáo vấn đề',
      icon: '⚠️',
      description: 'Báo cáo các vấn đề phát sinh cần xử lý'
    }
  ];
  
  export const PHAN_HE = [
    { id: 'thien-minh-duong', name: 'Thiên Minh Đường', role: '2D' },
    { id: 'tay-van-cac', name: 'Tây Vân Các', role: '3D' },
    { id: 'hoa-tam-duong', name: 'Họa Tam Đường', role: 'CODE' },
    { id: 'ho-ly-son-trang', name: 'Hồ Ly Sơn trang', role: 'MARKETING' },
    { id: 'hoa-van-cac', name: 'Hoa Vân Các', role: 'FILM' },
    { id: 'tinh-van-cac', name: 'Tinh Vân Các', role: 'GAME_DESIGN' }
  ];
  
  export const QUYEN = {
    ADMIN_TONG: 'admin-tong',
    ADMIN_CON: 'admin-con',
    THANH_VIEN: 'member'
  };
