import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDetectionDto {
  @IsNotEmpty()
  @IsString()
  cameraName: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  timestamp: string;
}
