// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    // private readonly userService: UserService, // Injete o serviço de usuário
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // const user = await this.userService.findByEmail(email); // Método para buscar o usuário por email
    // if (user && await bcrypt.compare(password, user.password)) {
    //   const { password, ...result } = user;
    //   return result; // Retorne o usuário excluindo a senha
    // }
    return null;
  }

  async login(user: UserEntity) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
