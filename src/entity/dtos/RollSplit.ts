import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export default class RollSplit {
  @IsNotEmpty()
  @IsNumber()
  RollId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  SplitWeight: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  NetLength: number;

  @IsOptional()
  @IsIn(['CUTTING', 'WAREHOUSE', 'SAMPLING', 'SEWING', 'TRAINING'])
  GeneratedAt: string;
}
