import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateDetectionDto {
  @IsOptional()
  @IsInt()
  statusId?: number;

  @IsOptional()
  @IsInt()
  priorityId?: number;

  @IsOptional()
  @IsInt()
  assignedToId?: number;

  @IsOptional()
  @IsString()
  note?: string;
}