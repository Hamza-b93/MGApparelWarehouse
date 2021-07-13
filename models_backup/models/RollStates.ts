import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("NonClusteredIndex-20210507-101524", ["rollState", "locationCategory"], {
  unique: true,
})
@Index(
  "NonClusteredIndex-20210507-102509",
  ["rollStateId", "rollState", "locationCategory"],
  { unique: true }
)
@Index("RollStates_pk", ["rollStateId"], { unique: true })
@Index(
  "RollStates_RollState_LocationCategory_uindex",
  ["rollState", "locationCategory"],
  { unique: true }
)
@Index("RollStates_RollState_uindex", ["rollState"], { unique: true })
@Index("RollStates_RollStateId_uindex", ["rollStateId"], { unique: true })
@Entity("RollStates", { schema: "Essentials" })
export class RollStates {
  @PrimaryGeneratedColumn({ type: "int", name: "RollStateId" })
  rollStateId: number;

  @Column("datetime", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime", { name: "UpdatedAt", default: () => "getdate()" })
  updatedAt: Date;

  @Column("nvarchar", { name: "RollState", length: 32 })
  rollState: string;

  @Column("nvarchar", { name: "LocationCategory", length: 32 })
  locationCategory: string;
}
