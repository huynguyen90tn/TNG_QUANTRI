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
<<<<<<< HEAD
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
=======
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
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
        where('nhiemVuId', '==', nhiemVuId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(tinhNangQuery);
<<<<<<< HEAD
      return snapshot.docs.map(doc => formatDocumentData(doc));
    } catch (error) {
      handleError(error, 'Lỗi khi lấy danh sách tính năng');
=======
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tính năng:', error);
      throw error;
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
    }
  }

  async getTinhNang(tinhNangId) {
<<<<<<< HEAD
    if (!tinhNangId) {
      throw new Error('tinhNangId là bắt buộc');
    }

    try {
      const docRef = doc(this.collectionRef, tinhNangId);
=======
    try {
      const docRef = doc(db, this.collection, tinhNangId);
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Tính năng không tồn tại');
      }

<<<<<<< HEAD
      return formatDocumentData(docSnap);
    } catch (error) {
      handleError(error, 'Lỗi khi lấy thông tin tính năng');
=======
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin tính năng:', error);
      throw error;
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
    }
  }

  async themTinhNang(tinhNangData) {
<<<<<<< HEAD
    if (!tinhNangData?.nhiemVuId) {
      throw new Error('nhiemVuId là bắt buộc');
    }

    try {
      const timestamp = Timestamp.now();
=======
    try {
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
    }
  }

  async capNhatTinhNang(tinhNangId, tinhNangData) {
<<<<<<< HEAD
    if (!tinhNangId || !tinhNangData) {
      throw new Error('tinhNangId và dữ liệu cập nhật là bắt buộc');
    }

    try {
      const docRef = doc(this.collectionRef, tinhNangId);
      const timestamp = Timestamp.now();
      const updateData = {
        ...tinhNangData,
        updatedAt: timestamp
=======
    try {
      const docRef = doc(db, this.collection, tinhNangId);
      const updateData = {
        ...tinhNangData,
        updatedAt: Timestamp.now()
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
      };

      await updateDoc(docRef, updateData);
      return {
        id: tinhNangId,
        ...updateData,
<<<<<<< HEAD
        updatedAt: timestamp.toDate()
      };
    } catch (error) {
      handleError(error, 'Lỗi khi cập nhật tính năng');
=======
        updatedAt: updateData.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật tính năng:', error);
      throw error;
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
    }
  }

  async xoaTinhNang(tinhNangId) {
<<<<<<< HEAD
    if (!tinhNangId) {
      throw new Error('tinhNangId là bắt buộc');
    }

    try {
      const docRef = doc(this.collectionRef, tinhNangId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      handleError(error, 'Lỗi khi xóa tính năng');
=======
    try {
      const docRef = doc(db, this.collection, tinhNangId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa tính năng:', error);
      throw error;
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
    }
  }

  async capNhatTienDo(tinhNangId, phanHe, tienDoData) {
<<<<<<< HEAD
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
=======
    try {
      const docRef = doc(db, this.collection, tinhNangId);
      const updateData = {
        [phanHe]: {
          ...tienDoData,
          updatedAt: Timestamp.now()
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
        }
      };

      await updateDoc(docRef, updateData);
      return {
        id: tinhNangId,
<<<<<<< HEAD
        ...updateData,
        updatedAt: timestamp.toDate()
      };
    } catch (error) {
      handleError(error, 'Lỗi khi cập nhật tiến độ');
=======
        ...updateData
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật tiến độ:', error);
      throw error;
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
    }
  }

  async getTienDoTheoNgay(nhiemVuId, startDate, endDate) {
<<<<<<< HEAD
    if (!nhiemVuId || !startDate || !endDate) {
      throw new Error('Thiếu thông tin lấy tiến độ theo ngày');
    }

    try {
      const tinhNangQuery = query(
        this.collectionRef,
=======
    try {
      const tinhNangRef = collection(db, this.collection);
      const tinhNangQuery = query(
        tinhNangRef,
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
        where('nhiemVuId', '==', nhiemVuId),
        where('updatedAt', '>=', startDate),
        where('updatedAt', '<=', endDate)
      );

      const snapshot = await getDocs(tinhNangQuery);
<<<<<<< HEAD
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

=======
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
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
        currentData.frontend += tn.frontend?.tienDo || 0;
        currentData.backend += tn.backend?.tienDo || 0;
        currentData.kiemThu += tn.kiemThu?.tienDo || 0;
        currentData.count += 1;
<<<<<<< HEAD

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
=======
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
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
    }
  }
}

export default new TinhNangService();