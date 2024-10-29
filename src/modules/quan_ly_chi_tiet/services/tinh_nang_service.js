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
  Timestamp,
  DocumentSnapshot
} from 'firebase/firestore';

const COLLECTION_NAME = 'tinh_nang';

const formatDocumentData = (docSnapshot) => {
  if (!docSnapshot?.exists()) return null;
  
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  };
};

const handleError = (error, message) => {
  console.error(message, error);
  throw new Error(`${message}: ${error.message}`);
};

class TinhNangService {
  constructor() {
    this.collectionRef = collection(db, COLLECTION_NAME);
  }

  async getDanhSachTinhNang(nhiemVuId) {
    if (!nhiemVuId) {
      throw new Error('nhiemVuId là bắt buộc');
    }

    try {
      const tinhNangQuery = query(
        this.collectionRef,
        where('nhiemVuId', '==', nhiemVuId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(tinhNangQuery);
      return snapshot.docs.map(doc => formatDocumentData(doc));
    } catch (error) {
      handleError(error, 'Lỗi khi lấy danh sách tính năng');
    }
  }

  async getTinhNang(tinhNangId) {
    if (!tinhNangId) {
      throw new Error('tinhNangId là bắt buộc');
    }

    try {
      const docRef = doc(this.collectionRef, tinhNangId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Tính năng không tồn tại');
      }

      return formatDocumentData(docSnap);
    } catch (error) {
      handleError(error, 'Lỗi khi lấy thông tin tính năng');
    }
  }

  async themTinhNang(tinhNangData) {
    if (!tinhNangData?.nhiemVuId) {
      throw new Error('nhiemVuId là bắt buộc');
    }

    try {
      const timestamp = Timestamp.now();
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
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const docRef = await addDoc(this.collectionRef, docData);
      return {
        id: docRef.id,
        ...docData,
        createdAt: timestamp.toDate(),
        updatedAt: timestamp.toDate()
      };
    } catch (error) {
      handleError(error, 'Lỗi khi thêm tính năng');
    }
  }

  async capNhatTinhNang(tinhNangId, tinhNangData) {
    if (!tinhNangId || !tinhNangData) {
      throw new Error('tinhNangId và dữ liệu cập nhật là bắt buộc');
    }

    try {
      const docRef = doc(this.collectionRef, tinhNangId);
      const timestamp = Timestamp.now();
      const updateData = {
        ...tinhNangData,
        updatedAt: timestamp
      };

      await updateDoc(docRef, updateData);
      return {
        id: tinhNangId,
        ...updateData,
        updatedAt: timestamp.toDate()
      };
    } catch (error) {
      handleError(error, 'Lỗi khi cập nhật tính năng');
    }
  }

  async xoaTinhNang(tinhNangId) {
    if (!tinhNangId) {
      throw new Error('tinhNangId là bắt buộc');
    }

    try {
      const docRef = doc(this.collectionRef, tinhNangId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      handleError(error, 'Lỗi khi xóa tính năng');
    }
  }

  async capNhatTienDo(tinhNangId, phanHe, tienDoData) {
    if (!tinhNangId || !phanHe || !tienDoData) {
      throw new Error('Thiếu thông tin cập nhật tiến độ');
    }

    try {
      const docRef = doc(this.collectionRef, tinhNangId);
      const timestamp = Timestamp.now();
      const updateData = {
        [phanHe]: {
          ...tienDoData,
          updatedAt: timestamp
        }
      };

      await updateDoc(docRef, updateData);
      return {
        id: tinhNangId,
        ...updateData,
        updatedAt: timestamp.toDate()
      };
    } catch (error) {
      handleError(error, 'Lỗi khi cập nhật tiến độ');
    }
  }

  async getTienDoTheoNgay(nhiemVuId, startDate, endDate) {
    if (!nhiemVuId || !startDate || !endDate) {
      throw new Error('Thiếu thông tin lấy tiến độ theo ngày');
    }

    try {
      const tinhNangQuery = query(
        this.collectionRef,
        where('nhiemVuId', '==', nhiemVuId),
        where('updatedAt', '>=', startDate),
        where('updatedAt', '<=', endDate)
      );

      const snapshot = await getDocs(tinhNangQuery);
      const tinhNangList = snapshot.docs.map(doc => formatDocumentData(doc));

      const tienDoMap = new Map();

      tinhNangList.forEach(tn => {
        if (!tn?.updatedAt) return;

        const ngay = tn.updatedAt.toISOString().split('T')[0];
        const currentData = tienDoMap.get(ngay) || {
          frontend: 0,
          backend: 0,
          kiemThu: 0,
          count: 0
        };

        currentData.frontend += tn.frontend?.tienDo || 0;
        currentData.backend += tn.backend?.tienDo || 0;
        currentData.kiemThu += tn.kiemThu?.tienDo || 0;
        currentData.count += 1;

        tienDoMap.set(ngay, currentData);
      });

      return Array.from(tienDoMap.entries())
        .map(([ngay, data]) => ({
          ngay,
          frontend: Math.round(data.frontend / data.count),
          backend: Math.round(data.backend / data.count),
          kiemThu: Math.round(data.kiemThu / data.count)
        }))
        .sort((a, b) => new Date(a.ngay) - new Date(b.ngay));
    } catch (error) {
      handleError(error, 'Lỗi khi lấy tiến độ theo ngày');
    }
  }
}

export default new TinhNangService();