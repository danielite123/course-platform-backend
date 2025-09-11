import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsDateString()
  DOB?: string;
}
