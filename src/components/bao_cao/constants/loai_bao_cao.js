 
// src/components/bao_cao/constants/loai_bao_cao.js
export const LOAI_BAO_CAO = [
    {
      id: 'bao-cao-du-an',
      label: 'Báo cáo dự án',
      icon: '📊',
      description: 'Báo cáo tiến độ và tình hình dự án',
      mauBaoCao: {
        tieuDe: 'Báo cáo dự án [Tên dự án]',
        mauNoiDung: `
  # Tình hình dự án
  - Tiến độ hiện tại:
  - Công việc đã hoàn thành:
  - Công việc đang thực hiện:
  - Các vấn đề phát sinh:
  
  # Kế hoạch tiếp theo
  - Công việc cần thực hiện:
  - Deadline dự kiến:
  - Nguồn lực cần thiết:
  
  # Đề xuất và kiến nghị
  - Đề xuất giải pháp:
  - Yêu cầu hỗ trợ:
        `
      }
    },
    {
      id: 'bao-cao-nhiem-vu',
      label: 'Báo cáo nhiệm vụ',
      icon: '✅',
      description: 'Báo cáo tiến độ nhiệm vụ được giao',
      mauBaoCao: {
        tieuDe: 'Báo cáo nhiệm vụ [Tên nhiệm vụ]',
        mauNoiDung: `
  # Chi tiết công việc
  - Nội dung đã thực hiện:
  - Kết quả đạt được:
  - Thời gian thực hiện:
  - Khó khăn gặp phải:
  
  # Đánh giá và đề xuất
  - Tự đánh giá kết quả:
  - Đề xuất cải thiện:
  - Yêu cầu hỗ trợ:
        `
      }
    },
    {
      id: 'bao-cao-ngay',
      label: 'Báo cáo công việc',
      icon: '📝',
      description: 'Báo cáo công việc hàng ngày',
      mauBaoCao: {
        tieuDe: 'Báo cáo công việc ngày [Ngày]',
        mauNoiDung: `
  # Công việc đã thực hiện
  - Nhiệm vụ 1:
    + Thời gian:
    + Kết quả:
  - Nhiệm vụ 2:
    + Thời gian:
    + Kết quả:
  
  # Kế hoạch ngày mai
  - Công việc cần làm:
  - Thời gian dự kiến:
  
  # Ghi chú
  - Các vấn đề cần lưu ý:
  - Đề xuất (nếu có):
        `
      }
    },
    {
      id: 'bao-cao-van-de',
      label: 'Báo cáo vấn đề',
      icon: '⚠️',
      description: 'Báo cáo các vấn đề phát sinh cần xử lý',
      mauBaoCao: {
        tieuDe: 'Báo cáo vấn đề [Tên vấn đề]',
        mauNoiDung: `
  # Mô tả vấn đề
  - Tình trạng hiện tại:
  - Nguyên nhân (nếu có):
  - Mức độ ảnh hưởng:
  - Thời điểm phát sinh:
  
  # Đề xuất giải pháp
  - Giải pháp ngắn hạn:
  - Giải pháp dài hạn:
  - Nguồn lực cần thiết:
  
  # Kế hoạch xử lý
  - Các bước thực hiện:
  - Thời gian dự kiến:
  - Người phụ trách:
        `
      }
    },
    {
      id: 'bao-cao-tuan',
      label: 'Báo cáo tuần',
      icon: '📅',
      description: 'Tổng hợp công việc và kế hoạch theo tuần',
      mauBaoCao: {
        tieuDe: 'Báo cáo tuần [Số tuần]',
        mauNoiDung: `
  # Tổng quan công việc tuần qua
  - Các nhiệm vụ đã hoàn thành:
  - Các nhiệm vụ đang thực hiện:
  - Khó khăn gặp phải:
  
  # Kế hoạch tuần tới
  - Công việc ưu tiên:
  - Mục tiêu cần đạt:
  - Nguồn lực cần thiết:
  
  # Đánh giá và đề xuất
  - Đánh giá hiệu suất:
  - Các vấn đề tồn đọng:
  - Đề xuất cải thiện:
        `
      }
    }
  ];
  
  export const PHAN_HE = [
    {
      id: 'thien-minh-duong',
      name: 'Thiên Minh Đường',
      role: '2D',
      color: 'blue',
      description: 'Phụ trách thiết kế 2D, UI/UX'
    },
    {
      id: 'tay-van-cac',
      name: 'Tây Vân Các',
      role: '3D',
      color: 'purple',
      description: 'Phụ trách mô hình và animation 3D'
    },
    {
      id: 'hoa-tam-duong',
      name: 'Họa Tam Đường',
      role: 'CODE',
      color: 'green',
      description: 'Phụ trách phát triển phần mềm'
    },
    {
      id: 'ho-ly-son-trang',
      name: 'Hồ Ly Sơn trang',
      role: 'MARKETING',
      color: 'orange',
      description: 'Phụ trách marketing và truyền thông'
    },
    {
      id: 'hoa-van-cac',
      name: 'Hoa Vân Các',
      role: 'FILM',
      color: 'red',
      description: 'Phụ trách sản xuất video và phim'
    },
    {
      id: 'tinh-van-cac',
      name: 'Tinh Vân Các',
      role: 'GAME_DESIGN',
      color: 'yellow',
      description: 'Phụ trách thiết kế game'
    }
  ];
  
  export const QUYEN = {
    ADMIN_TONG: 'admin-tong',
    ADMIN_CON: 'admin-con',
    THANH_VIEN: 'member'
  };
  
  export const TRANG_THAI_DU_AN = {
    DANG_CHO: 'đang-chờ',
    DANG_THUC_HIEN: 'đang-thực-hiện',
    HOAN_THANH: 'hoàn-thành',
    TAM_DUNG: 'tạm-dừng',
    HUY_BO: 'hủy-bỏ'
  };
  
  export const generateMaBaoCao = (loaiBaoCao, phanHe, index) => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const phanHeInfo = PHAN_HE.find(ph => ph.id === phanHe);
    const phanHeCode = phanHeInfo ? phanHeInfo.role : 'GEN';
    
    const loaiBaoCaoInfo = LOAI_BAO_CAO.find(lbc => lbc.id === loaiBaoCao);
    const loaiCode = loaiBaoCaoInfo ? loaiBaoCao.slice(0, 3).toUpperCase() : 'RPT';
    
    const sequence = index.toString().padStart(3, '0');
    
    return `${phanHeCode}-${loaiCode}-${year}${month}${day}-${sequence}`;
  };