import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskResponseDto } from './dto/task-response.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTask: TaskResponseDto = {
    id: 'uuid-1',
    title: 'テストタスク',
    description: 'テスト説明',
    done: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTasksService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('すべてのタスクを取得できること', async () => {
      mockTasksService.findAll.mockResolvedValue([mockTask]);

      const result = await controller.findAll();

      expect(result).toEqual([mockTask]);
      expect(mockTasksService.findAll).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('タスクを削除できること', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      await controller.remove('uuid-1');

      expect(mockTasksService.remove).toHaveBeenCalledWith('uuid-1');
    });
  });
});
