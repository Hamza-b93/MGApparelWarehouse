import { IsIn, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export default class AllocatedTo {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  RollId: number;

  @IsNotEmpty()
  @IsIn([
    'WAREHOUSE',
    'CUTTING',
    'SAMPLING',
    'SEWING',
    'TRAINING',
    'OUTSIDE PROCESSING',
  ])
  AllocatedTo: string;
}
