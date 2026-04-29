export class TaskDescription {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static from(value: string | undefined): TaskDescription {
    if (!value) {
      return new TaskDescription('');
    }
    if (value.length > 1000) {
      throw new Error('TaskDescription は1000文字以下である必要があります');
    }
    return new TaskDescription(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TaskDescription): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
