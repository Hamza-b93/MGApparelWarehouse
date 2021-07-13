import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("Activities_ActivityId_uindex", ["activityId"], { unique: true })
@Index("Activities_pk", ["activityId"], { unique: true })
@Index("ClusteredIndex-20210507-111751", ["activityId"], { unique: true })
@Index(
  "NonClusteredIndex-20210507-111802",
  [
    "startTime",
    "endTime",
    "smallWaste",
    "largeWaste",
    "shift",
    "activityStatus",
    "activityId",
  ],
  { unique: true }
)
@Index(
  "NonClusteredIndex-20210507-112014",
  [
    "updatedAt",
    "startTime",
    "endTime",
    "smallWaste",
    "largeWaste",
    "activityStatus",
    "activityId",
  ],
  { unique: true }
)
@Entity("Activities", { schema: "Data" })
export class Activities {
  @PrimaryGeneratedColumn({ type: "int", name: "ActivityId" })
  activityId: number;

  @Column("datetime", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime", { name: "UpdatedAt", default: () => "getdate()" })
  updatedAt: Date;

  @Column("date", { name: "UpdatedAtDate", default: () => "getdate()" })
  updatedAtDate: Date;

  @Column("nvarchar", { name: "ActivityStatus", length: 10 })
  activityStatus: string;

  @Column("datetime", { name: "StartTime", nullable: true })
  startTime: Date | null;

  @Column("datetime", { name: "EndTime", nullable: true })
  endTime: Date | null;

  @Column("decimal", {
    name: "SmallWaste",
    nullable: true,
    precision: 10,
    scale: 4,
  })
  smallWaste: number | null;

  @Column("decimal", {
    name: "LargeWaste",
    nullable: true,
    precision: 10,
    scale: 4,
  })
  largeWaste: number | null;

  @Column("nvarchar", { name: "Shift", nullable: true, length: 8 })
  shift: string | null;
}
