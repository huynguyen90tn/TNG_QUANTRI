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

class NhiemVuService {
  constructor() {
    this.collection = 'nhiem_vu';
  }

  async getDanhSachNhiemVu(duAnId) {
    try {
      const nhiemVuRef = collection(db, this.collection);
      const nhiemVuQuery = query(
        nhiemVuRef,
        where('duAnId', '==', duAnId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(nhiemVuQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        deadline: doc.data().deadline?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhiệm vụ:', error);
      throw error;
    }
  }

  async getNhiemVu(nhiemVuId) {
    try {
      const docRef = doc(db, this.collection, nhiemVuId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Nhiệm vụ không tồn tại');
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
        deadline: docSnap.data().deadline?.toDate(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nhiệm vụ:', error);
      throw error;
    }
  }

  async themNhiemVu(nhiemVuData) {
    try {
      const docData = {
        ...nhiemVuData,
        deadline: Timestamp.fromDate(new Date(nhiemVuData.deadline)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.collection), docData);
      return {
        id: docRef.id,
        ...docData,
        deadline: docData.deadline.toDate(),
        createdAt: docData.createdAt.toDate(),
        updatedAt: docData.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi thêm nhiệm vụ:', error);
      throw error;
    }
  }

  async capNhatNhiemVu(nhiemVuId, nhiemVuData) {
    try {
      const docRef = doc(db, this.collection, nhiemVuId);
      const updateData = {
        ...nhiemVuData,
        deadline: Timestamp.fromDate(new Date(nhiemVuData.deadline)),
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, updateData);
      return {
        id: nhiemVuId,
        ...updateData,
        deadline: updateData.deadline.toDate(),
        updatedAt: updateData.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật nhiệm vụ:', error);
      throw error;
    }
  }

  async xoaNhiemVu(nhiemVuId) {
    try {
      const docRef = doc(db, this.collection, nhiemVuId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa nhiệm vụ:', error);
      throw error;
    }
  }

  async getTienDoNhiemVu(nhiemVuId) {
    try {
      const tinhNangRef = collection(db, 'tinh_nang');
      const tinhNangQuery = query(
        tinhNangRef,
        where('nhiemVuId', '==', nhiemVuId)
      );
      
      const snapshot = await getDocs(tinhNangQuery);
      const tinhNangList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const tienDoTrungBinh = tinhNangList.reduce((acc, tn) => {
        const frontendTienDo = tn.frontend?.tienDo || 0;
        const backendTienDo = tn.backend?.tienDo || 0;
        const kiemThuTienDo = tn.kiemThu?.tienDo || 0;
        
        return acc + (frontendTienDo + backendTienDo + kiemThuTienDo) / 3;
      }, 0) / (tinhNangList.length || 1);

      return Math.round(tienDoTrungBinh);
    } catch (error) {
      console.error('Lỗi khi lấy tiến độ nhiệm vụ:', error);
      throw error;
    }
  }
}

export default new NhiemVuService();