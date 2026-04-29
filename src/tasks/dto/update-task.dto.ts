import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  description?: string;

  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
