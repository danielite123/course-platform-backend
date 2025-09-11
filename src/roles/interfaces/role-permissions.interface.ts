import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username?: string;
  role: Role;
  [key: string]: any;
}

export interface RolePermissionContext {
  user: AuthenticatedUser;
  requiredRoles: Role[];
  resourceId?: string;
  resourceOwnerId?: string;
}

export interface RoleGuardOptions {
  requireAllRoles?: boolean;
  allowResourceOwner?: boolean;
  customPermissionCheck?: (context: RolePermissionContext) => boolean;
}
