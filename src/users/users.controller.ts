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

@UseGuards(JwtGuard)
@Controller('users') //
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  getUser(@Param() idUserDTO: idUserDTO) {
    return this.usersService.getUser(idUserDTO.id);
  }

  @Get('owned-films')
  @Render('my-list')
  getOwnedFilms() {
    return { message: 'my-list' };
  }

  @Post(':id/balance')
  addBalance(@Body() incDTO: incBalanceDTO, @Param() idUserDTO: idUserDTO) {
    console.log(incDTO.increment);
    console.log(idUserDTO.id);
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

  @Get(':id/detail')
  @Render('account-detail')
  getAccountDetail(@Param() dto: idUserDTO) {
    return this.usersService.getUser(dto.id);
  }

  @Patch(':id')
  updateUser(
    @Param() idUserDTO: idUserDTO,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return this.usersService.updateUser(idUserDTO.id, updateUserDTO);
  }
}
