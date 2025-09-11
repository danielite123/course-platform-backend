import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { hasAnyRole } from '../roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import {
  AuthenticatedUser,
  RolePermissionContext,
  RoleGuardOptions,
} from '../interfaces/role-permissions.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const user = request['user'] as AuthenticatedUser;
    const userId = request['userId'] as string;

    if (!user || !userId) {
      this.logger.warn('Unauthenticated access attempt to protected route');
      throw new UnauthorizedException(
        'Authentication required. Please use AuthGuard before RolesGuard.',
      );
    }

    const hasPermission = hasAnyRole(user.role, requiredRoles);

    if (!hasPermission) {
      this.logger.warn(
        `User ${user.id} with role ${user.role} attempted to access route requiring roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`,
      );
    }

    this.logger.debug(
      `User ${user.id} with role ${user.role} granted access to route requiring roles: ${requiredRoles.join(', ')}`,
    );

    return true;
  }

  private checkCustomPermissions(
    context: RolePermissionContext,
    options: RoleGuardOptions,
  ): boolean {
    if (options.customPermissionCheck) {
      return options.customPermissionCheck(context);
    }

    if (options.allowResourceOwner && context.resourceOwnerId) {
      return context.user.id === context.resourceOwnerId;
    }

    return false;
  }
}
