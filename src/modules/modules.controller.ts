import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post(':courseId/create') async createModule(
    @Param('courseId') courseId: string,
    @Body() dto: CreateModuleDto,
  ) {
    return this.modulesService.createModule(courseId, dto);
  }

  @Get(':id')
  async getModuleById(@Param('id') id: string) {
    return this.modulesService.getModuleById(id);
  }

  @Get(':courseId')
  async getModulesByCourseId(@Param('courseId') courseId: string) {
    return this.modulesService.getModulesByCourseId(courseId);
  }

  @Delete(':id')
  async deleteModule(@Param('id') id: string) {
    return this.modulesService.deleteModule(id);
  }

  @Patch(':id')
  async updateModule(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.updateModule(id, dto);
  }
}
