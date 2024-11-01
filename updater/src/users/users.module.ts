import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { RoleEntity } from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        UserEntity,
        RoleEntity,
      ]
    )
  ],
  controllers: [UsersController],
  providers: [UserService]
})
export class UsersModule {}
