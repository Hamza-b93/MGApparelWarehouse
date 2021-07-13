import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export default class ApiResponse {
  @IsNotEmpty()
  @IsInt()
  ErrorNumber: number;

  @IsNotEmpty()
  ErrorMessage: string;

  @IsOptional()
  Data: Record<string, any>;

  constructor(
    ErrorNumber: number,
    ErrorMessage: string,
    Data: Record<string, any> = null,
  ) {
    this.ErrorNumber = ErrorNumber;
    this.ErrorMessage = ErrorMessage;
    this.Data = Data;
  }
}
