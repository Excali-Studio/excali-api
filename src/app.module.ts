import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CanvasModule } from './canvas/canvas.module';
import { config } from './config/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    AuthModule,
    UserModule,
    CanvasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
