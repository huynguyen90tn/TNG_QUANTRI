import { db } from '../../../services/firebase';
import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

class DuAnService {
  constructor() {
    this.collection = 'du_an';
  }

  async getDanhSachDuAn(phongBan) {
    try {
      const duAnRef = collection(db, this.collection);
      let duAnQuery = duAnRef;

      if (phongBan) {
        duAnQuery = query(
          duAnRef,
          where('phongBan', '==', phongBan),
          orderBy('updatedAt', 'desc')
        );
      }

      const snapshot = await getDocs(duAnQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ngayBatDau: doc.data().ngayBatDau?.toDate(),
        ngayKetThuc: doc.data().ngayKetThuc?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dự án:', error);
      throw error;
    }
  }

  async getDuAn(duAnId) {
    try {
      const docRef = doc(db, this.collection, duAnId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Dự án không tồn tại');
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
        ngayBatDau: docSnap.data().ngayBatDau?.toDate(),
        ngayKetThuc: docSnap.data().ngayKetThuc?.toDate(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin dự án:', error);
      throw error;
    }
  }

  async themDuAn(duAnData) {
    try {
      const docData = {
        ...duAnData,
        ngayBatDau: Timestamp.fromDate(new Date(duAnData.ngayBatDau)),
        ngayKetThuc: Timestamp.fromDate(new Date(duAnData.ngayKetThuc)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.collection), docData);
      return {
        id: docRef.id,
        ...docData,
        ngayBatDau: docData.ngayBatDau.toDate(),
        ngayKetThuc: docData.ngayKetThuc.toDate(),
        createdAt: docData.createdAt.toDate(),
        updatedAt: docData.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi thêm dự án:', error);
      throw error;
    }
  }

  async capNhatDuAn(duAnId, duAnData) {
    try {
      const docRef = doc(db, this.collection, duAnId);
      const updateData = {
        ...duAnData,
        ngayBatDau: Timestamp.fromDate(new Date(duAnData.ngayBatDau)),
        ngayKetThuc: Timestamp.fromDate(new Date(duAnData.ngayKetThuc)),
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, updateData);
      return {
        id: duAnId,
        ...updateData,
        ngayBatDau: updateData.ngayBatDau.toDate(),
        ngayKetThuc: updateData.ngayKetThuc.toDate(),
        updatedAt: updateData.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật dự án:', error);
      throw error;
    }
  }

  async xoaDuAn(duAnId) {
    try {
      const docRef = doc(db, this.collection, duAnId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa dự án:', error);
      throw error;
    }
  }

  async getThongKeDuAn(duAnId) {
    try {
      const nhiemVuRef = collection(db, 'nhiem_vu');
      const nhiemVuQuery = query(
        nhiemVuRef,
        where('duAnId', '==', duAnId)
      );
      
      const snapshot = await getDocs(nhiemVuQuery);
      const nhiemVuList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const tongSoNhiemVu = nhiemVuList.length;
      const daHoanThanh = nhiemVuList.filter(nv => 
        nv.trangThai === 'HOAN_THANH'
      ).length;
      const dangThucHien = nhiemVuList.filter(nv => 
        nv.trangThai === 'DANG_LAM'
      ).length;
      const quaHan = nhiemVuList.filter(nv => {
        const deadline = nv.deadline?.toDate();
        return deadline && deadline < new Date() && nv.trangThai !== 'HOAN_THANH';
      }).length;

      const tienDoTrungBinh = nhiemVuList.reduce(
        (acc, nv) => acc + (nv.tienDo || 0), 
        0
      ) / (tongSoNhiemVu || 1);

      return {
        tongSoNhiemVu,
        daHoanThanh,
        dangThucHien,
        quaHan,
        tienDoTrungBinh: Math.round(tienDoTrungBinh)
      };
    } catch (error) {
      console.error('Lỗi khi lấy thống kê dự án:', error);
      throw error;
    }
  }
}

export default new DuAnService();