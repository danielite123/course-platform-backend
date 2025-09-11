# Role-Based Permission System

A comprehensive role-based access control (RBAC) system for NestJS with TypeScript support.

## Features

- ✅ **Role Hierarchy**: ADMIN > INSTRUCTOR > STUDENT
- ✅ **Database Integration**: Verifies user roles against database
- ✅ **JWT Integration**: Works with existing authentication
- ✅ **TypeScript Support**: Full type safety
- ✅ **Flexible Decorators**: Multiple ways to assign roles
- ✅ **Global or Per-Route**: Apply guards globally or per controller
- ✅ **Comprehensive Logging**: Detailed access logs
- ✅ **Error Handling**: Proper HTTP status codes

## Quick Start

### 1. Import the System

```typescript
import { Roles, UserRole, AdminOnly, InstructorOrAdmin } from './roles';
```

### 2. Apply to Controllers

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  Roles,
  Role,
  AdminOnly,
  InstructorOnly,
  InstructorOrAdmin,
  RolesGuard,
} from './roles';
import { AuthGuard } from './guard/auth.guard';

@Controller('courses')
export class CourseController {
  // Admin only - IMPORTANT: @AdminOnly() must come BEFORE @UseGuards()
  @AdminOnly()
  @UseGuards(AuthGuard, RolesGuard)
  @Get('admin-stats')
  getAdminStats() {
    return { message: 'Admin statistics' };
  }

  // Instructor only
  @InstructorOnly()
  @UseGuards(AuthGuard, RolesGuard)
  @Get('instructor-dashboard')
  getInstructorDashboard() {
    return { message: 'Instructor dashboard' };
  }

  // Instructor or Admin
  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Post('create')
  createCourse() {
    return { message: 'Course created' };
  }

  // Specific roles
  @Roles(Role.STUDENT, Role.INSTRUCTOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('enrolled')
  getEnrolledCourses() {
    return { message: 'Enrolled courses' };
  }

  // Public route (no decorator needed)
  @Get('public')
  getPublicCourses() {
    return { message: 'Public courses' };
  }
}
```

## Available Decorators

### @Roles(...roles)

Assign specific roles to a route.

```typescript
@Roles(UserRole.ADMIN)                    // Admin only
@Roles(UserRole.INSTRUCTOR, UserRole.ADMIN) // Instructor or Admin
@Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN) // Any role
```

### Convenience Decorators

```typescript
@AdminOnly()           // Same as @Roles(Role.ADMIN)
@InstructorOnly()      // Same as @Roles(Role.INSTRUCTOR)
@InstructorOrAdmin()   // Same as @Roles(Role.INSTRUCTOR, Role.ADMIN)
@Authenticated()       // Same as @Roles(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN)
```

## Role Hierarchy

The system uses a hierarchical permission model:

```
ADMIN (Level 3)     - Full access
INSTRUCTOR (Level 2) - Course management, student oversight
STUDENT (Level 1)    - Basic access, course enrollment
```

Higher-level roles automatically have permissions of lower-level roles.

## Configuration Options

### Manual Application

The `RolesGuard` must be applied manually using `@UseGuards(AuthGuard, RolesGuard)` on each route that needs role-based access control.

### Per-Controller Application

```typescript
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  // All routes in this controller will use role checking
}
```

### Per-Route Application

```typescript
@Controller('mixed')
export class MixedController {
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  adminOnly() {
    return { message: 'Admin only' };
  }

  @Get('public')
  public() {
    return { message: 'Public access' };
  }
}
```

## TypeScript Integration

### User Interface

```typescript
import { AuthenticatedUser } from './roles';

@Controller('profile')
export class ProfileController {
  @Get()
  getProfile(@Req() req: { user: AuthenticatedUser }) {
    // req.user is fully typed with role information
    return {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      username: req.user.username,
    };
  }
}
```

### Role Checking

```typescript
import { UserRole, hasRolePermission, hasAnyRole } from './roles';

// Check if user has sufficient role
const canAccess = hasRolePermission(userRole, UserRole.ADMIN);

// Check if user has any of the required roles
const canAccess = hasAnyRole(userRole, [UserRole.INSTRUCTOR, UserRole.ADMIN]);
```

## Error Responses

### Unauthenticated (401)

```json
{
  "statusCode": 401,
  "message": "Authentication required"
}
```

### Insufficient Permissions (403)

```json
{
  "statusCode": 403,
  "message": "Access denied. Required roles: ADMIN. Your role: STUDENT"
}
```

## Database Integration

The guard automatically:

- ✅ Verifies user exists in database
- ✅ Fetches fresh role data
- ✅ Updates request with current user information
- ✅ Handles user deletion scenarios

## Logging

The system provides comprehensive logging:

```
[RolesGuard] User 123 with role ADMIN granted access to route requiring roles: ADMIN
[RolesGuard] User 456 with role STUDENT attempted to access route requiring roles: ADMIN
[RolesGuard] User 789 not found in database
```

## Best Practices

### 1. Use Specific Roles

```typescript
// ✅ Good - Specific role
@Roles(UserRole.ADMIN)

// ❌ Avoid - Too broad
@Roles(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
```

### 2. Combine with Authentication

```typescript
@Controller('protected')
@UseGuards(AuthGuard, RolesGuard) // AuthGuard first, then RolesGuard
export class ProtectedController {
  // Routes here require both authentication and role checking
}
```

### 3. Public Routes

```typescript
// No decorator needed for public routes
@Get('public')
getPublicData() {
  return { message: 'Public data' };
}
```

### 4. Type Safety

```typescript
// Always type your request objects
@Get('profile')
getProfile(@Req() req: { user: AuthenticatedUser }) {
  // TypeScript will provide autocomplete and type checking
  return req.user;
}
```

## Migration from Existing Code

1. **Import the roles system**:

   ```typescript
   import { Roles, UserRole } from './roles';
   ```

2. **Replace existing role checks**:

   ```typescript
   // Before
   if (user.role !== 'ADMIN') {
     throw new ForbiddenException('Admin required');
   }

   // After
   @Roles(UserRole.ADMIN)
   adminMethod() {
     // Method automatically protected
   }
   ```

3. **Update request typing**:

   ```typescript
   // Before
   @Req() req: { user: any }

   // After
   @Req() req: { user: AuthenticatedUser }
   ```

## Troubleshooting

### Common Issues

1. **"Authentication required" error**:
   - Ensure `AuthGuard` is applied before `RolesGuard`
   - Check JWT token is valid and present

2. **"Access denied" error**:
   - Verify user has correct role in database
   - Check role hierarchy requirements

3. **TypeScript errors**:
   - Import `AuthenticatedUser` interface
   - Use proper typing for request objects

### Debug Mode

Enable debug logging by setting log level to `debug` in your NestJS configuration.

## Security Considerations

- ✅ **Database Verification**: Always checks current user state
- ✅ **Role Hierarchy**: Prevents privilege escalation
- ✅ **Comprehensive Logging**: Audit trail for access attempts
- ✅ **Type Safety**: Prevents runtime role errors
- ✅ **JWT Integration**: Works with existing auth system
