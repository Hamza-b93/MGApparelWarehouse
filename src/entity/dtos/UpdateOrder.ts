import {
  IsAscii,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Length,
} from 'class-validator';

export default class UpdateOrder {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  RollId: number;

  @IsNotEmpty()
  @IsAscii()
  @Length(1, 64)
  Order: string;
}
