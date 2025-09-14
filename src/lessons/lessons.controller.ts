import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto./lesson.dto';
import { InstructorOrAdmin, RolesGuard } from 'src/roles';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':moduleId/create')
  async create(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonsService.createLesson(moduleId, dto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.lessonsService.getLessonById(id);
  }

  @UseGuards(AuthGuard)
  @Get(':moduleId/list')
  async getByModuleId(@Param('moduleId') moduleId: string) {
    return this.lessonsService.getLessonsByModuleId(moduleId);
  }

  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.lessonsService.deleteLesson(id);
  }

  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CreateLessonDto) {
    return this.lessonsService.updateLesson(id, dto);
  }
}
