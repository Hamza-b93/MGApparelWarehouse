import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export default class AssignTag {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  RollId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  TagId: number;
}
