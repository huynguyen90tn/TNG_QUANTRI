// src/modules/quan_ly_thanh_vien/services/thanh_vien_service.js
import { db } from '../../../services/firebase';
import { 
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const COLLECTION_NAME = 'members'; // Thay đổi collection name thành 'members'

export const thanhVienService = {
  layDanhSach: async () => {
    try {
      const membersRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(membersRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        anhDaiDien: doc.data().avatar || '',
        hoTen: doc.data().fullName || '',
        email: doc.data().email || '',
        phongBan: doc.data().department || '',
        chucVu: doc.data().position || '',
        trangThai: doc.data().status || 'DANG_CONG_TAC',
        soDienThoai: doc.data().phone || '',
        ngayVao: doc.data().joinDate || '',
      }));

    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách thành viên: ${error.message}`);
    }
  },

  capNhatTrangThai: async (id, trangThai) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: trangThai,
        lastUpdated: new Date()
      });
      return { id, trangThai };
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật trạng thái: ${error.message}`);
    }
  },

  them: async (data) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        fullName: data.hoTen,
        email: data.email,
        department: data.phongBan,
        position: data.chucVu,
        status: 'DANG_CONG_TAC',
        phone: data.soDienThoai || '',
        avatar: data.anhDaiDien || '',
        joinDate: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return {
        id: docRef.id,
        ...data,
        trangThai: 'DANG_CONG_TAC'
      };
    } catch (error) {
      throw new Error(`Lỗi khi thêm thành viên: ${error.message}`);
    }
  },

  xoa: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return id;
    } catch (error) {
      throw new Error(`Lỗi khi xóa thành viên: ${error.message}`);
    }
  },
};

export default thanhVienService;