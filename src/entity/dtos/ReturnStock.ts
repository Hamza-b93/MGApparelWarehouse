import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export default class ReturnStock {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  RollId: number;

  @IsBoolean()
  @IsNotEmpty()
  @IsIn([true, false])
  IsRejected: boolean;
}
