import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // const role = await this.roleRepository.findOne({
    //   where: { id: createUserDto.roleId },
    // });
    
    // if (!role) {
    //   throw new NotFoundException(`Role with ID ${createUserDto.roleId} not found`);
    // }

    const now = new Date();

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.getHashedPassword(createUserDto.password), // Salva a senha já com hash
      roleId: null,
      createdAt: now,
    });

    return await this.userRepository.save(newUser);
  }

  private async getHashedPassword(password): Promise<string> {
    const saltOrRounds = 11;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  // Get all users
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find({ relations: ['roleId'] });
  }

  // Get user by ID
  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['roleId'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update user by ID
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // Verifica se o roleId está presente no DTO para buscar a RoleEntity correspondente
    let role = null;
    // if (updateUserDto.roleId) {
    //   role = await this.roleRepository.findOne({ where: { id: updateUserDto.roleId } });
      
    //   if (!role) {
    //     throw new NotFoundException(`Role with ID ${updateUserDto.roleId} not found`);
    //   }
    // }
  
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
      roleId: role,
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    return await this.userRepository.save(user);
  }

  // Delete user by ID
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
