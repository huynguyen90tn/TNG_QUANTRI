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

class TinhNangService {
  constructor() {
    this.collection = 'tinh_nang';
  }

  async getDanhSachTinhNang(nhiemVuId) {
    try {
      const tinhNangRef = collection(db, this.collection);
      const tinhNangQuery = query(
        tinhNangRef,
        where('nhiemVuId', '==', nhiemVuId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(tinhNangQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tính năng:', error);
      throw error;
    }
  }

  async getTinhNang(tinhNangId) {
    try {
      const docRef = doc(db, this.collection, tinhNangId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Tính năng không tồn tại');
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin tính năng:', error);
      throw error;
    }
  }

  async themTinhNang(tinhNangData) {
    try {
      const docData = {
        ...tinhNangData,
        frontend: {
          ...tinhNangData.frontend,
          tienDo: 0,
          trangThai: 'MOI'
        },
        backend: {
          ...tinhNangData.backend,
          tienDo: 0,
          trangThai: 'MOI',
          apiEndpoints: tinhNangData.backend?.apiEndpoints || []
        },
        kiemThu: {
          ...tinhNangData.kiemThu,
          tienDo: 0,
          trangThai: 'MOI',
          loaiTest: tinhNangData.kiemThu?.loaiTest || []
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.collection), docData);
      return {
        id: docRef.id,
        ...docData,
        createdAt: docData.createdAt.toDate(),
        updatedAt: docData.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi thêm tính năng:', error);
      throw error;
    }
  }

  async capNhatTinhNang(tinhNangId, tinhNangData) {
    try {
      const docRef = doc(db, this.collection, tinhNangId);
      const updateData = {
        ...tinhNangData,
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, updateData);
      return {
        id: tinhNangId,
        ...updateData,
        updatedAt: updateData.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật tính năng:', error);
      throw error;
    }
  }

  async xoaTinhNang(tinhNangId) {
    try {
      const docRef = doc(db, this.collection, tinhNangId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa tính năng:', error);
      throw error;
    }
  }

  async capNhatTienDo(tinhNangId, phanHe, tienDoData) {
    try {
      const docRef = doc(db, this.collection, tinhNangId);
      const updateData = {
        [phanHe]: {
          ...tienDoData,
          updatedAt: Timestamp.now()
        }
      };

      await updateDoc(docRef, updateData);
      return {
        id: tinhNangId,
        ...updateData
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật tiến độ:', error);
      throw error;
    }
  }

  async getTienDoTheoNgay(nhiemVuId, startDate, endDate) {
    try {
      const tinhNangRef = collection(db, this.collection);
      const tinhNangQuery = query(
        tinhNangRef,
        where('nhiemVuId', '==', nhiemVuId),
        where('updatedAt', '>=', startDate),
        where('updatedAt', '<=', endDate)
      );

      const snapshot = await getDocs(tinhNangQuery);
      const tinhNangList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Tính trung bình tiến độ theo ngày
      const tienDoMap = new Map();
      tinhNangList.forEach(tn => {
        const ngay = tn.updatedAt.toDate().toISOString().split('T')[0];
        if (!tienDoMap.has(ngay)) {
          tienDoMap.set(ngay, {
            frontend: 0,
            backend: 0,
            kiemThu: 0,
            count: 0
          });
        }
        
        const currentData = tienDoMap.get(ngay);
        currentData.frontend += tn.frontend?.tienDo || 0;
        currentData.backend += tn.backend?.tienDo || 0;
        currentData.kiemThu += tn.kiemThu?.tienDo || 0;
        currentData.count += 1;
      });

      // Chuyển đổi Map thành mảng kết quả
      return Array.from(tienDoMap.entries()).map(([ngay, data]) => ({
        ngay,
        frontend: Math.round(data.frontend / data.count),
        backend: Math.round(data.backend / data.count),
        kiemThu: Math.round(data.kiemThu / data.count)
      }));
    } catch (error) {
      console.error('Lỗi khi lấy tiến độ theo ngày:', error);
      throw error;
    }
  }
}

export default new TinhNangService();