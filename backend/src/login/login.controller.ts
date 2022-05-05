import { Controller, Get, Redirect, UseGuards, Request } from '@nestjs/common';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { FtStrategy } from './ft.strategy';

@Controller('login')
export class LoginController {
    constructor(private ftstrategy: FtStrategy) {}
    @Get('42')
    @UseGuards(FtOauthGuard)
    ftAuth() {
        return ;
    }

    @Get('42/return')
    @UseGuards(FtOauthGuard)
    @Redirect('http://localhost:3001/Profile')
    ftAuthCallback(@Request() req) {
        return this.ftstrategy.login(req.user);
    }
}