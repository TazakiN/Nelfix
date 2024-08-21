import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch, //
  Post,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { idUserDTO, incBalanceDTO, UpdateUserDTO } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserGuard } from './guard';

@UseGuards(JwtGuard)
@Controller('users') //
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  getUser(@Param() idUserDTO: idUserDTO) {
    return this.usersService.getUser(idUserDTO.id);
  }

  @Post(':id/balance')
  addBalance(@Body() incDTO: incBalanceDTO, @Param() idUserDTO: idUserDTO) {
    return this.usersService.addBalance(idUserDTO.id, incDTO.increment);
  }

  @Delete(':id')
  deleteUser(@Param() idUserDTO: idUserDTO) {
    return this.usersService.deleteUser(idUserDTO.id);
  }

  @Get()
  searchUser(@Query('q') query: string) {
    return this.usersService.searchUser(query);
  }

  @UseGuards(UserGuard)
  @Get(':id/detail')
  @Render('account-detail')
  getAccountDetail(@Param() dto: idUserDTO) {
    return this.usersService.getUser(dto.id);
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  updateUser(
    @Param() idUserDTO: idUserDTO,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return this.usersService.updateUser(idUserDTO.id, updateUserDTO);
  }
}
