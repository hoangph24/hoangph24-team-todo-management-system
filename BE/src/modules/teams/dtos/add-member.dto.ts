import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AddMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
} 