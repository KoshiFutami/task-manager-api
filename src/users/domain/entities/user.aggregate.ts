import { UserId } from '../value-objects/user-id';
import { UserName } from '../value-objects/user-name';

export class User {
  private readonly id: UserId;
  private name: UserName;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(props: { id: UserId; name: UserName; createdAt: Date; updatedAt: Date }) {
    this.id = props.id;
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(name: UserName): User {
    return new User({
      id: UserId.create(),
      name: name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static from(props: { id: string; name: string; createdAt: Date; updatedAt: Date }): User {
    return new User({
      id: UserId.from(props.id),
      name: UserName.from(props.name),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  getId(): UserId {
    return this.id;
  }

  getName(): UserName {
    return this.name;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
