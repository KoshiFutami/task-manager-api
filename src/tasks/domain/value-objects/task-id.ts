import { v4 as uuidv4 } from 'uuid';

export class TaskId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(): TaskId {
    return new TaskId(uuidv4());
  }

  static from(value: string): TaskId {
    if (!value || typeof value !== 'string') {
      throw new Error('TaskId は空でない文字列である必要があります');
    }
    return new TaskId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TaskId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
