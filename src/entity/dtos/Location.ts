import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export default class Location {
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(100)
  Rack: number;

  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(100)
  Locator: number;

  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(100)
  Bin: number;
}
