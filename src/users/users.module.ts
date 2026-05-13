import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './application/services/users.service';
import { IUserRepository } from './domain/repositories/user.repository';
import { UserRepositoryImpl } from './infrastructure/user.repository';
import { User as UserEntity } from './infrastructure/persistence/user.entity';

@Module({
  exports: [IUserRepository],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [
    UsersService,
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UsersModule {}
