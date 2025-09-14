import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
} from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsOptional()
  @IsUrl({}, { message: 'videoUrl must be a valid URL' })
  videoUrl?: string;

  @IsInt()
  @Min(1)
  order: number;
}

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsUrl({}, { message: 'videoUrl must be a valid URL' })
  videoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}
