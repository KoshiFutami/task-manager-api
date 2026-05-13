import { User } from '../entities/user.aggregate';
import { UserId } from '../value-objects/user-id';

export abstract class IUserRepository {
  abstract save(user: User): Promise<void>;

  abstract findById(userId: UserId): Promise<User | null>;

  abstract findAll(): Promise<User[]>;
}
