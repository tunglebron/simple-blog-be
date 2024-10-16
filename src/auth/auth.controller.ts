import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/auth.dto';
import { User } from 'src/user/entities/user.entity';
import { LocalGuard } from './guard/local.guard';

@Controller({
  version: '1',
  path: '/auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  signIn(@Request() req: { user: User }) {
    return this.authService.signIn(req.user);
  }
}
