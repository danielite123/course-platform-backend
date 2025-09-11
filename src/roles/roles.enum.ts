import { Role } from '@prisma/client';

export { Role as UserRole };

export const ROLE_HIERARCHY = {
  [Role.STUDENT]: 1,
  [Role.INSTRUCTOR]: 2,
  [Role.ADMIN]: 3,
} as const;

export function hasRolePermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function hasAnyRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.some((role) => hasRolePermission(userRole, role));
}
