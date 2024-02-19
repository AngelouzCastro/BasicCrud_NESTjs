import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//entitys
import { User } from './user.entity';
import { Profile } from './profile.entity';

import { JwtModule } from '@nestjs/jwt';

import { jwtConstans } from './jwt.constans';
import { JwtStrategy } from './jwt.strategy';

@Module({
  //importamos todas nuestras entidades que tenemos, User y Profile
  imports: [TypeOrmModule.forFeature([User, Profile]),
  //configracion de jwt
  JwtModule.register({
    secret: jwtConstans.secrets,
    signOptions: {expiresIn: '1h'}
  })
],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  //para exportar a otros modulos
  exports: [UsersService]
})
export class UsersModule {}
