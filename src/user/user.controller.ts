import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { AdminOnly, RolesGuard } from 'src/roles';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: { userId: string }) {
    const userId = req.userId;
    const user = await this.userService.getProfile(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  async updateProfile(
    @Req() req: { userId: string },
    @Body() data: UpdateUserDto,
  ) {
    const userId = req.userId;
    const updatedUser = await this.userService.updateProfile(userId, data);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  @AdminOnly()
  @UseGuards(AuthGuard, RolesGuard)
  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
