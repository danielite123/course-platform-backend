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
import { ModulesService } from './modules.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module';
import { AuthGuard } from 'src/guard/auth.guard';
import { InstructorOrAdmin, RolesGuard } from 'src/roles';

@InstructorOrAdmin()
@UseGuards(AuthGuard, RolesGuard)
@Controller('module')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post(':courseId/create') async createModule(
    @Param('courseId') courseId: string,
    @Body() dto: CreateModuleDto,
  ) {
    return this.modulesService.createModule(courseId, dto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getModuleById(@Param('id') id: string) {
    return this.modulesService.getModuleById(id);
  }

  @UseGuards(AuthGuard)
  @Get(':courseId/list')
  async getModulesByCourseId(@Param('courseId') courseId: string) {
    return this.modulesService.getModulesByCourseId(courseId);
  }

  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async deleteModule(@Param('id') id: string) {
    return this.modulesService.deleteModule(id);
  }

  @InstructorOrAdmin()
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  async updateModule(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.updateModule(id, dto);
  }
}
