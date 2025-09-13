import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CourseStatus } from '@prisma/client';

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

  async getCourseDetailsById(courseId: string) {
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
        modules: {
          include: {
            lessons: true,
          },
        },
        reviews: {
          include: {
            student: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
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

  async updateCourse(courseId: string, data: UpdateCourseDto) {
    await this.prisma.course.update({
      where: { id: courseId },
      data,
    });

    return this.prisma.course.update({
      where: { id: courseId },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async updateCourseStatus(courseId: string, status: CourseStatus) {
    const updatedCourse = await this.prisma.course.update({
      where: { id: courseId },
      data: { status },
      select: { id: true, status: true },
    });
    return updatedCourse;
  }
}
