export abstract class DomainEvent {
  abstract readonly eventType: string;
  readonly occurredAt: Date;

  constructor() {
    this.occurredAt = new Date();
  }
}
