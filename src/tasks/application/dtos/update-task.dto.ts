import { IsString, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
