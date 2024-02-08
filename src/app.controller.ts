import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { User } from './user/schema/user.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  async login(@Body() payload): Promise<{ token: string, user: User }> {
    const { username, password } = payload;
    const user = await this.authService.validateUser(username, password);

    if(user) {
      const token = await this.authService.generateJwtToken(user);
      return { token, user };
    }
  }
}
