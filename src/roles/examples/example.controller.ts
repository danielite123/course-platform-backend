import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  Roles,
  AdminOnly,
  InstructorOnly,
  InstructorOrAdmin,
  Authenticated,
} from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AuthenticatedUser } from '../interfaces/role-permissions.interface';
import { AuthGuard } from '../../guard/auth.guard';

/**
 * Example controller demonstrating role-based access control
 * This file is for reference only - you can delete it after understanding the usage
 */
@Controller('example')
export class ExampleController {
  // Public route - no authentication or role required
  @Get('public')
  getPublicData() {
    return { message: 'This is public data accessible to everyone' };
  }

  // Admin only route - IMPORTANT: @AdminOnly() must come BEFORE @UseGuards()
  @AdminOnly()
  @UseGuards(AuthGuard, RolesGuard)
  @Get('admin-stats')
  getAdminStats(@Req() req: { user: AuthenticatedUser }) {
    return {
      message: 'Admin statistics',
      user: req.user.email,
      role: req.user.role,
    };
  }

  // Instructor only route
  @InstructorOnly()
  @UseGuards(AuthGuard, RolesGuard)
  @Get('instructor-dashboard')
  getInstructorDashboard(@Req() req: { user: AuthenticatedUser }) {
    return {
      message: 'Instructor dashboard',
      instructor: req.user.email,
      role: req.user.role,
    };
  }

  // Instructor or Admin route
  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Post('create-course')
  createCourse(@Req() req: { user: AuthenticatedUser }) {
    return {
      message: 'Course created successfully',
      createdBy: req.user.email,
      role: req.user.role,
    };
  }

  // Specific roles using @Roles decorator
  @Roles(Role.STUDENT, Role.INSTRUCTOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('enrolled-courses')
  getEnrolledCourses(@Req() req: { user: AuthenticatedUser }) {
    return {
      message: 'Enrolled courses',
      student: req.user.email,
      role: req.user.role,
    };
  }

  // Any authenticated user
  @Authenticated()
  @UseGuards(AuthGuard, RolesGuard)
  @Get('profile')
  getProfile(@Req() req: { user: AuthenticatedUser }) {
    return {
      message: 'User profile',
      user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role,
      },
    };
  }

  // Multiple role requirements (user must have at least one of these roles)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('course-management')
  getCourseManagement(@Req() req: { user: AuthenticatedUser }) {
    return {
      message: 'Course management dashboard',
      user: req.user.email,
      role: req.user.role,
    };
  }
}
