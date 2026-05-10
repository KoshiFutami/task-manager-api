import { v4 as uuidv4 } from 'uuid';

export class UserId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(): UserId {
    return new UserId(uuidv4());
  }

  static from(value: string): UserId {
    if (!value || typeof value !== 'string') {
      throw new Error('UserId は空でない文字列である必要があります');
    }
    return new UserId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
