import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export default class Params {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  Page: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  Limit: number;

  @IsOptional()
  @IsAlphanumeric()
  SearchOn: string;

  @IsOptional()
  @IsAlphanumeric()
  SearchBy: string;
}
