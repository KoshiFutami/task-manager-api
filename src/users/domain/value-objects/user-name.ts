export class UserName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static from(value: string): UserName {
    if (!value || typeof value !== 'string') {
      throw new Error('UserName は空でない文字列である必要があります');
    }
    if (value.length > 50) {
      throw new Error('UserName は50文字以内である必要があります');
    }

    return new UserName(value);
  }

  getValue(): string {
    return this.value;
  }
}
