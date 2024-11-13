// File: src/constants/roles.js
// Nhánh: main

export const ROLES = {
    ADMIN_TONG: 'admin-tong',
    ADMIN_CON: 'admin-con',
    MEMBER: 'member',
    KY_THUAT: 'ky_thuat'
  };
  
  export const SHARED_ROLES = [ROLES.ADMIN_TONG, ROLES.ADMIN_CON, ROLES.MEMBER, ROLES.KY_THUAT];
  export const ADMIN_ROLES = [ROLES.ADMIN_TONG, ROLES.ADMIN_CON];
  export const MEMBER_ONLY = [ROLES.MEMBER];
  export const TECHNICAL_ROLES = [ROLES.ADMIN_TONG, ROLES.KY_THUAT];
  
  export default ROLES;