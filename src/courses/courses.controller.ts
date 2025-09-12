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
import { CreateCourseDto } from './dto/course.dto';
import { InstructorOrAdmin, RolesGuard } from 'src/roles';
import { AuthGuard } from 'src/guard/auth.guard';
import { AuthenticatedRequest } from 'src/types/authenticatedt.interface';

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

  @InstructorOrAdmin()
  @UseGuards(AuthGuard)
  @Patch('update/:courseId')
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() data: Partial<CreateCourseDto>,
  ) {
    return this.coursesService.updateCourse(courseId, data);
  }

  @InstructorOrAdmin()
  @UseGuards(AuthGuard)
  @Delete('delete/:courseId')
  async deleteCourse(@Param('courseId') courseId: string) {
    return this.coursesService.deleteCourse(courseId);
  }
}
