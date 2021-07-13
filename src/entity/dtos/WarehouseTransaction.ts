import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export default class WarehouseTransaction {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  rollId: number;

  @IsBoolean()
  @IsOptional()
  IsManual: boolean;

  @IsBoolean()
  @IsOptional()
  IsRejected: boolean;

  @IsIn([1, 2, 3, 4, 5])
  @IsOptional()
  Antenna: number;
}
