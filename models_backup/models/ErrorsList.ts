import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("Errors_ErrorId_uindex", ["errorId"], { unique: true })
@Index("Errors_ErrorMessage_uindex", ["errorMessage"], { unique: true })
@Index("Errors_ErrorNumber_uindex", ["errorNumber"], { unique: true })
@Index("Errors_pk", ["errorId"], { unique: true })
@Entity("ErrorsList", { schema: "Logging" })
export class ErrorsList {
  @PrimaryGeneratedColumn({ type: "int", name: "ErrorId" })
  errorId: number;

  @Column("datetime", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime", { name: "UpdatedAt", default: () => "getdate()" })
  updatedAt: Date;

  @Column("nvarchar", { name: "ErrorType", length: 32 })
  errorType: string;

  @Column("int", { name: "ErrorNumber" })
  errorNumber: number;

  @Column("nvarchar", { name: "ErrorMessage", length: 64 })
  errorMessage: string;
}
