import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(instructorId: string, data: CreateCourseDto) {
    const instructor = await this.prisma.user.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      throw new HttpException('Instructor not found', 404);
    }

    const course = await this.prisma.course.create({
      data: {
        ...data,
        instructor: { connect: { id: instructorId } },
      },
    });

    return course;
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async getCourseById(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!course) {
      throw new HttpException('Course not found', 404);
    }

    return course;
  }

  async getCoursesByInstructor(userId: string) {
    return this.prisma.course.findMany({
      where: { instructorId: userId },
      include: {
        instructor: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteCourse(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new HttpException('Course not found', 404);
    }

    await this.prisma.course.delete({
      where: { id: courseId },
    });
    return { message: 'Course deleted successfully' };
  }

  async updateCourse(courseId: string, data: Partial<CreateCourseDto>) {
    const updatedCourse = await this.prisma.course.update({
      where: { id: courseId },
      data,
    });
    return updatedCourse;
  }
}
