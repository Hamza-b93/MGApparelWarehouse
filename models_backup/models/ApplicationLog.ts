import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("ApplicationLog_AppLogId_uindex", ["appLogId"], { unique: true })
@Index("ApplicationLog_pk", ["appLogId"], { unique: true })
@Entity("ApplicationLog", { schema: "Logging" })
export class ApplicationLog {
  @PrimaryGeneratedColumn({ type: "int", name: "AppLogId" })
  appLogId: number;

  @Column("datetime", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime", { name: "UpdatedAt", default: () => "getdate()" })
  updatedAt: Date;

  @Column("nvarchar", { name: "RequestIpAddr", length: 32 })
  requestIpAddr: string;

  @Column("nvarchar", { name: "RequestBody" })
  requestBody: string;

  @Column("nvarchar", { name: "RequestType", length: 8 })
  requestType: string;

  @Column("nvarchar", { name: "RequestApi", length: 64, default: () => "''" })
  requestApi: string;
}
