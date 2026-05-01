export class TaskTitle {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static from(value: string): TaskTitle {
    if (!value || typeof value !== 'string') {
      throw new Error('TaskTitle は空でない文字列である必要があります');
    }
    if (value.length < 1 || value.length > 255) {
      throw new Error('TaskTitle は1文字以上、255文字以下である必要があります');
    }
    return new TaskTitle(value);
  }

  equals(other: TaskTitle): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
