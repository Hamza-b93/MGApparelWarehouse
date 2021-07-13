import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export default class FabricInspection {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  RollId: number;

  @IsNotEmpty()
  @IsIn(['CUTTING', 'WAREHOUSE', 'SAMPLING', 'SEWING', 'TRAINING'])
  RejectedAt: string;

  @IsBoolean()
  @IsNotEmpty()
  IsRejected: number;
}
