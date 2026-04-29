import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTask = {
    id: 'uuid-1',
    title: 'テストタスク',
    description: 'テスト説明',
    done: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('すべてのタスクを取得できること', async () => {
      mockRepository.find.mockResolvedValue([mockTask]);

      const result = await service.findAll();

      expect(result).toEqual([mockTask]);
    });
  });

  describe('create', () => {
    it('新しいタスクを登録できること', async () => {
      const createTaskDto: CreateTaskDto = {
        title: '新規タスクタイトル',
        description: '新規タスク説明',
      };

      mockRepository.create.mockReturnValue(createTaskDto);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('タスクを更新できること', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: '更新タスクタイトル',
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.update('uuid-1', updateTaskDto);

      expect(result).toEqual(mockTask);
    });

    it('タスクが見つからないときはNotFoundExceptionを投げること', async () => {
      const updateTaskDto: UpdateTaskDto = { title: '更新' };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateTaskDto))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('タスクを削除できること', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('uuid-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('uuid-1');
    });

    it('タスクが見つからないときはNotFoundExceptionを投げること', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
