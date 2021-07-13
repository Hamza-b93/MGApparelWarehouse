import { StockedOutRolls } from './../views/StockedOutRolls';
import { StockedInRolls } from './../views/StockedInRolls';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class ScannerStockSummary {
  @IsNotEmpty()
  @IsNumber()
  StockedInRolls: number;

  @IsNotEmpty()
  @IsNumber()
  StockedOutRolls: number;

  @IsNotEmpty()
  LatestStockInRolls: StockedInRolls[];

  @IsNotEmpty()
  LatestStockOutRolls: StockedOutRolls[];
}
