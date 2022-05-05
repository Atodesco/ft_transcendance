import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FtStrategy } from './ft.strategy';
import { LoginController } from './login.controller';
import { SessionSerializer } from './session.serializer';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';


@Module( {
    imports: [JwtModule.register({secret: jwtConstants.secret,
    signOptions: {expiresIn: '60s'},
    }),
    ],
    controllers: [LoginController],
    providers: [ConfigService, FtStrategy, SessionSerializer, JwtStrategy],
})
export class LoginModule {}