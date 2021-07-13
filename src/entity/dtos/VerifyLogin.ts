import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';

export default class VerifyLogin {
  @IsNotEmpty()
  @Length(4, 16)
  @IsAlphanumeric()
  UserName: string;

  @IsNotEmpty()
  @Length(4, 8)
  UserPassword: string;
}
