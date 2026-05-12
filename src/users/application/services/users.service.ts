import { User } from 'src/users/domain/entities/user.aggregate';
import { UserResponseDto } from '../dtos/user-response.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserName } from 'src/users/domain/value-objects/user-name';
import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.toDto(user));
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = User.create(UserName.from(createUserDto.name));
    await this.userRepository.save(user);

    return this.toDto(user);
  }

  private toDto(user: User): UserResponseDto {
    return {
      id: user.getId().getValue(),
      name: user.getName().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
