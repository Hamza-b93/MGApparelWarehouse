import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import Location from './Location';

export default class UpdateLocation {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  RollId: number;

  @IsNotEmpty()
  Location: Location;
}
