// src/components/su_kien_review/services/nhac_nho_service.js
class NhacNhoService {
    constructor() {
      this.permissions = null;
      this.checkPermission();
    }
  
    async checkPermission() {
      if (!("Notification" in window)) {
        console.log("Trình duyệt không hỗ trợ thông báo");
        return;
      }
  
      if (Notification.permission !== "denied") {
        this.permissions = await Notification.requestPermission();
      }
    }
  
    async guiThongBao(suKien) {
      if (Notification.permission !== "granted") {
        return;
      }
  
      try {
        const notification = new Notification("Nhắc nhở sự kiện", {
          body: `Sự kiện "${suKien.tenSuKien}" sẽ diễn ra trong vòng 30 phút nữa!`,
          icon: "/path/to/icon.png", // Thêm icon nếu có
          badge: "/path/to/badge.png", // Thêm badge nếu có
          vibrate: [200, 100, 200]
        });
  
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
  
        // Tự động đóng sau 5 giây
        setTimeout(() => {
          notification.close();
        }, 5000);
  
      } catch (error) {
        console.error("Lỗi khi gửi thông báo:", error);
      }
    }
  
    async datLichNhacNho(suKien) {
      const ngayToChuc = new Date(suKien.ngayToChuc);
      const thoiGianNhacNho = new Date(ngayToChuc.getTime() - 30 * 60000); // Trước 30 phút
  
      const bayGio = new Date();
      const thoiGianCho = thoiGianNhacNho.getTime() - bayGio.getTime();
  
      if (thoiGianCho > 0) {
        setTimeout(() => {
          this.guiThongBao(suKien);
        }, thoiGianCho);
      }
    }
  }
  
  export const nhacNhoService = new NhacNhoService();
  