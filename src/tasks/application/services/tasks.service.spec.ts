import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TasksService } from './tasks.service';
import { ITaskRepository } from 'src/tasks/domain/repositories/task.repository';
import { IUserRepository } from 'src/users/domain/repositories/user.repository';
import { Task } from 'src/tasks/domain/entities/task.aggregate';
import { User } from 'src/users/domain/entities/user.aggregate';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

const buildMockTask = (
  overrides: Partial<{
    id: string;
    title: string;
    description: string;
    status: string;
    assigneeId: string | null;
  }> = {},
): Task => {
  return Task.from({
    id: overrides.id ?? 'uuid-1',
    title: overrides.title ?? 'テストタスク',
    description: overrides.description ?? 'テスト説明',
    status: overrides.status ?? 'todo',
    assigneeId: overrides.assigneeId ?? null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  });
};

const buildMockUser = (): User => {
  return User.from({
    id: 'user-uuid-1',
    name: 'テストユーザー',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  });
};

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: ITaskRepository,
          useValue: mockTaskRepository,
        },
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('すべてのタスクを取得できること', async () => {
      const mockTask = buildMockTask();
      mockTaskRepository.findAll.mockResolvedValue([mockTask]);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: mockTask.getId().getValue(),
          title: mockTask.getTitle().getValue(),
          description: mockTask.getDescription().getValue(),
          status: mockTask.getStatus().getValue(),
          statusDisplayName: mockTask.getStatus().getDisplayName(),
          assigneeId: null,
          createdAt: mockTask.getCreatedAt(),
          updatedAt: mockTask.getUpdatedAt(),
        },
      ]);
    });
  });

  describe('create', () => {
    it('新しいタスクを登録できること', async () => {
      const createTaskDto: CreateTaskDto = {
        title: '新規タスクタイトル',
        description: '新規タスク説明',
      };
      mockTaskRepository.save.mockResolvedValue(undefined);

      const result = await service.create(createTaskDto);

      expect(mockTaskRepository.save).toHaveBeenCalledTimes(1);
      expect(result.title).toBe('新規タスクタイトル');
      expect(result.description).toBe('新規タスク説明');
      expect(result.status).toBe('todo');
      expect(result.assigneeId).toBeNull();
    });
  });

  describe('update', () => {
    it('タイトルを更新できること', async () => {
      const mockTask = buildMockTask();
      const updateTaskDto: UpdateTaskDto = { title: '更新タイトル' };
      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(undefined);

      const result = await service.update('uuid-1', updateTaskDto);

      expect(result.title).toBe('更新タイトル');
    });

    it('ステータスを更新できること', async () => {
      const mockTask = buildMockTask();
      const updateTaskDto: UpdateTaskDto = { status: 'in_progress' };
      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(undefined);

      const result = await service.update('uuid-1', updateTaskDto);

      expect(result.status).toBe('in_progress');
    });

    it('タスクが見つからないときはNotFoundExceptionを投げること', async () => {
      const updateTaskDto: UpdateTaskDto = { title: '更新' };
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateTaskDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('タスクを削除できること', async () => {
      const mockTask = buildMockTask();
      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.delete.mockResolvedValue(undefined);

      await service.remove('uuid-1');

      expect(mockTaskRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('タスクが見つからないときはNotFoundExceptionを投げること', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignTo', () => {
    it('タスクにユーザーをアサインできること', async () => {
      const mockTask = buildMockTask();
      const mockUser = buildMockUser();
      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTaskRepository.save.mockResolvedValue(undefined);

      const result = await service.assignTo('uuid-1', 'user-uuid-1');

      expect(result.assigneeId).toBe('user-uuid-1');
    });

    it('タスクが見つからないときはNotFoundExceptionを投げること', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(service.assignTo('invalid-id', 'user-uuid-1')).rejects.toThrow(NotFoundException);
    });

    it('ユーザーが見つからないときはNotFoundExceptionを投げること', async () => {
      const mockTask = buildMockTask();
      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.assignTo('uuid-1', 'invalid-user-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('unassign', () => {
    it('タスクのアサインを解除できること', async () => {
      const mockTask = buildMockTask({ assigneeId: 'user-uuid-1' });
      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(undefined);

      const result = await service.unassign('uuid-1');

      expect(result.assigneeId).toBeNull();
    });

    it('タスクが見つからないときはNotFoundExceptionを投げること', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(service.unassign('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
