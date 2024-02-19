import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './posts/post.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'nestdb',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],//carga entidades
    synchronize: true
  }), UsersModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
