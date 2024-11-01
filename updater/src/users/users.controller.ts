import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}
  @Get("/hello")
  async hello(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersService.create(createUserDto);
  }
  // Cria um novo usuário
  @Post("/create")
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersService.create(createUserDto);
  }

  // Retorna todos os usuários
  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.usersService.findAll();
    return users.map(user => plainToInstance(UserEntity, user));
  }

  // Retorna um usuário pelo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Atualiza um usuário existente
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const updatedUser = await this.usersService.update(+id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Exclui um usuário
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(+id);
  }
}
