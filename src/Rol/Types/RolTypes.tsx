export interface Permission {
  id: number;
  name: string;
  path: string;
  description: string;
  status: string;
}
export interface PermissionType {
  permissionId: number;
  permissionName: string;
}

export interface RolTypes {
  id: number;
  name: string;
  status: string;
  permissions: PermissionType[]; 
  numberPermissions?: number; 
}