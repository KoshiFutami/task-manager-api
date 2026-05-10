import { Injectable } from '@nestjs/common';
import { User } from '../domain/entities/user.aggregate';
import { IUserRepository } from '../domain/repositories/user.repository';
import { User as UserEntity } from './persistence/user.entity';
import { Repository } from 'typeorm';
import { UserId } from '../domain/value-objects/user-id';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepositoryImpl extends IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly ormRepository: Repository<UserEntity>,
  ) {
    super();
  }

  async save(user: User): Promise<void> {
    const entity = this.toPersistence(user);
    await this.ormRepository.save(entity);
  }

  async findById(userId: UserId): Promise<User | null> {
    const entity = await this.ormRepository.findOne({
      where: { id: userId.getValue() },
    });
    if (!entity) return null;

    return this.toDomain(entity);
  }

  async findAll(): Promise<User[]> {
    const entities = await this.ormRepository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  private toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.getId().getValue();
    entity.name = user.getName().getValue();
    entity.createdAt = user.getCreatedAt();
    entity.updatedAt = user.getUpdatedAt();
    return entity;
  }

  private toDomain(entity: UserEntity): User {
    return User.from({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
