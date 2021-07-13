import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export default class ClearAllocation {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  RollId: number;
}
