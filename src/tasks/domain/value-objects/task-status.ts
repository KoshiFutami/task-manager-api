export class TaskStatus {
  private readonly value: 'todo' | 'in_progress' | 'done';

  private constructor(value: string) {
    this.value = value as 'todo' | 'in_progress' | 'done';
  }

  static create(): TaskStatus {
    return new TaskStatus('todo');
  }

  static from(value: string): TaskStatus {
    if (!['todo', 'in_progress', 'done'].includes(value)) {
      throw new Error('無効なステータスです');
    }
    return new TaskStatus(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  canTransitionTo(nextStatus: TaskStatus): boolean {
    if (this.value === nextStatus.value) return false;

    if (this.value === 'done' && nextStatus.value === 'todo') return false;

    return true;
  }
}
