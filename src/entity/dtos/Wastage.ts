import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export default class Wastage {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  ActivityId: number;

  @IsNotEmpty()
  StartTime: Date;

  @IsNotEmpty()
  EndTime: Date;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  SmallWaste: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  LargeWaste: number;

  @IsOptional()
  @IsIn(['FIRST', 'SECOND'])
  Shift: string;

  @IsNotEmpty()
  RollIds: number[];
}
