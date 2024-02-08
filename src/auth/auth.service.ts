import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username);
    
        if (user) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            return user;
          }
        } else {
          throw new BadRequestException("Invalid Username");
        }
    
        throw new BadRequestException("Invalid Password");
    }

    async generateJwtToken(user): Promise<string> {
        const payload = { userid: user._id, username: user.username, role: user.role };
        return this.jwtService.sign(payload);
    }
}
