export class TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: string;
  statusDisplayName: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
