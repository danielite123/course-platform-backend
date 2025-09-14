import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { InstructorOrAdmin, RolesGuard } from 'src/roles';
import { AuthGuard } from 'src/guard/auth.guard';
import { AuthenticatedRequest } from 'src/types/authenticatedt.interface';
import { CourseStatus } from '@prisma/client';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Post('create')
  async createCourse(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateCourseDto,
  ) {
    const instructorId = req.user.id;
    return this.coursesService.createCourse(instructorId, data);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Get('my-courses')
  async getCoursesByInstructor(@Req() req: AuthenticatedRequest) {
    const instructorId = req.user.id;
    return this.coursesService.getCoursesByInstructor(instructorId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getCourseById(@Param('id') courseId: string) {
    return this.coursesService.getCourseById(courseId);
  }

  @UseGuards(AuthGuard)
  @Get(':id/details')
  async getCourseDetailsById(@Param('id') courseId: string) {
    return this.coursesService.getCourseDetailsById(courseId);
  }

  @InstructorOrAdmin()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateCourse(
    @Param('id') courseId: string,
    @Body() data: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(courseId, data);
  }

  @InstructorOrAdmin()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCourse(@Param('id') courseId: string) {
    return this.coursesService.deleteCourse(courseId);
  }

  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id/status')
  async changeCourseStatus(
    @Param('id') courseId: string,
    @Body('status') status: CourseStatus,
  ) {
    if (!Object.values(CourseStatus).includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    return this.coursesService.updateCourseStatus(courseId, status);
  }
}
