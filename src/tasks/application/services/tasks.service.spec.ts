import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITaskRepository } from 'src/tasks/domain/repositories/task.repository';
import { Task } from 'src/tasks/domain/entities/task.aggregate';
import { TaskTitle } from 'src/tasks/domain/value-objects/task-title';
import { TaskDescription } from 'src/tasks/domain/value-objects/task-description';
import { TaskStatus } from 'src/tasks/domain/value-objects/task-status';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

const buildMockTask = (
  overrides: Partial<{
    id: string;
    title: string;
    description: string;
    status: string;
  }> = {},
): Task => {
  return Task.from({
    id: overrides.id ?? 'uuid-1',
    title: overrides.title ?? 'テストタスク',
    description: overrides.description ?? 'テスト説明',
    status: overrides.status ?? 'todo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  });
};

describe('TasksService', () => {
  let service: TasksService;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: ITaskRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('すべてのタスクを取得できること', async () => {
      const mockTask = buildMockTask();
      mockRepository.findAll.mockResolvedValue([mockTask]);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: mockTask.getId().getValue(),
          title: mockTask.getTitle().getValue(),
          description: mockTask.getDescription().getValue(),
          status: mockTask.getStatus().getValue(),
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
      mockRepository.save.mockResolvedValue(undefined);

      const result = await service.create(createTaskDto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result.title).toBe('新規タスクタイトル');
      expect(result.description).toBe('新規タスク説明');
      expect(result.status).toBe('todo');
    });
  });

  describe('update', () => {
    it('タイトルを更新できること', async () => {
      const mockTask = buildMockTask();
      const updateTaskDto: UpdateTaskDto = { title: '更新タイトル' };
      mockRepository.findById.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(undefined);

      const result = await service.update('uuid-1', updateTaskDto);

      expect(result.title).toBe('更新タイトル');
    });

    it('ステータスを更新できること', async () => {
      const mockTask = buildMockTask();
      const updateTaskDto: UpdateTaskDto = { status: 'in_progress' };
      mockRepository.findById.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(undefined);

      const result = await service.update('uuid-1', updateTaskDto);

      expect(result.status).toBe('in_progress');
    });

    it('タスクが見つからないときはNotFoundExceptionを投げること', async () => {
      const updateTaskDto: UpdateTaskDto = { title: '更新' };
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateTaskDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('タスクを削除できること', async () => {
      const mockTask = buildMockTask();
      mockRepository.findById.mockResolvedValue(mockTask);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.remove('uuid-1');

      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('タスクが見つからないときはNotFoundExceptionを投げること', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
