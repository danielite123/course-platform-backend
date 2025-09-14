import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async createModule(courseId: string, dto: CreateModuleDto) {
    const lastOrder = await this.prisma.module.count({
      where: { courseId },
    });

    const module = await this.prisma.module.create({
      data: {
        course: { connect: { id: courseId } },
        title: dto.title,
        order: dto.order ?? lastOrder + 1,
      },
    });
    return module;
  }

  async getModuleById(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        lessons: true,
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }

  async getModulesByCourseId(courseId: string) {
    const modules = await this.prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return modules;
  }

  async deleteModule(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    await this.prisma.module.delete({
      where: { id },
    });
    return { message: `Module with ID ${id} deleted successfully` };
  }

  async updateModule(id: string, dto: UpdateModuleDto) {
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    await this.prisma.module.update({
      where: { id },
      data: dto,
    });
    return { message: `Module with ID ${id} updated successfully` };
  }
}
