// src/types/attendance.ts
export interface AttendanceRecord {
    id: string;
    userId: string;
    memberCode: string;
    fullName: string;
    department: string;
    workLocation: string;
    checkInTime: Date;
    isLate: boolean;
    lateReason?: string;
    hasReported: boolean;
    reportedTo?: {
      adminId: string;
      adminName: string;
      adminEmail: string;
      reportTime: Date;
    };
    createdAt: Date;
  }
  
  export interface Admin {
    id: string;
    fullName: string;
    email: string;
    role: 'admin-tong' | 'admin-con';
  }