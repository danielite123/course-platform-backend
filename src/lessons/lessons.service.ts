import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto./lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async createLesson(moduleId: string, dto: CreateLessonDto) {
    const lastOrder = await this.prisma.lesson.count({
      where: { moduleId },
    });

    const lesson = await this.prisma.lesson.create({
      data: {
        module: { connect: { id: moduleId } },
        title: dto.title,
        content: dto.content,
        videoUrl: dto.videoUrl,
        order: lastOrder + 1,
      },
    });

    return lesson;
  }

  async getLessonById(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    return lesson;
  }

  async getLessonsByModuleId(moduleId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: {
        order: 'asc',
      },
    });

    if (!lessons) {
      throw new HttpException(
        `No lessons found for module with ID ${moduleId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return lessons;
  }

  async deleteLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      throw new HttpException(
        `Lesson with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.lesson.delete({
      where: { id },
    });

    return { message: `Lesson with ID ${id} deleted successfully` };
  }

  async updateLesson(id: string, dto: UpdateLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      throw new HttpException(
        `Lesson with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.lesson.update({
      where: { id },
      data: dto,
    });

    return { message: `Lesson with ID ${id} updated successfully` };
  }
}
