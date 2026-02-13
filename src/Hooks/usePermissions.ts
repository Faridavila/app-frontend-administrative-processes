import { useMemo } from 'react';

interface Permission {
  permissionId: number;
  permissionName: string;
  permissionPath: string;
}

export const usePermissions = () => {
  const permissions = useMemo<Permission[]>(() => {
    const stored = localStorage.getItem('permissions');
    if (!stored) return [];
    
    try {
      return JSON.parse(stored) as Permission[];
    } catch {
      console.error('Error parsing permissions from localStorage');
      return [];
    }
  }, []);

  const hasPermission = (path: string): boolean => {
    // El Administrador tiene acceso a todo
    const rolName = localStorage.getItem('rol');
    if (rolName === 'Administrador') return true;

    // Verificar si tiene el permiso específico
    return permissions.some(perm => perm.permissionPath === path);
  };

  const hasAnyPermission = (paths: string[]): boolean => {
    return paths.some(path => hasPermission(path));
  };

  const getPermissions = (): Permission[] => {
    return permissions;
  };

  // 🔥 NUEVO: Obtener la primera ruta permitida
  const getFirstAllowedRoute = (): string => {
    const rolName = localStorage.getItem('rol');
    
    // Administrador siempre va al dashboard
    if (rolName === 'Administrador') {
      return '/dashboard';
    }

    // Obtener la primera ruta permitida
    if (permissions.length > 0) {
      return permissions[0].permissionPath;
    }

    return '/no-access';
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    getPermissions,
    getFirstAllowedRoute, 
  };
};