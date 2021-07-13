import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Rolls } from "./Rolls";

@Index("Allocations_AllocationId_uindex", ["allocationId"], { unique: true })
@Index("Allocations_pk", ["allocationId"], { unique: true })
@Index("ClusteredIndex-20210507-101932", ["allocationId"], { unique: true })
@Index(
  "NonClusteredIndex-20210507-101946",
  ["allocationStatus", "allocatedTo", "rollId", "allocationId"],
  {}
)
@Index(
  "NonClusteredIndex-20210507-102110",
  ["allocationStatus", "allocatedTo", "allocationId"],
  { unique: true }
)
@Entity("Allocations", { schema: "Data" })
export class Allocations {
  @PrimaryGeneratedColumn({ type: "int", name: "AllocationId" })
  allocationId: number;

  @Column("datetime", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime", { name: "UpdatedAt", default: () => "getdate()" })
  updatedAt: Date;

  @Column("date", { name: "UpdatedAtDate", default: () => "getdate()" })
  updatedAtDate: Date;

  @Column("int", { name: "RollId" })
  rollId: number;

  @Column("nvarchar", {
    name: "AllocationStatus",
    length: 8,
    default: () => "(0)",
  })
  allocationStatus: string;

  @Column("nvarchar", { name: "AllocatedTo", length: 32 })
  allocatedTo: string;

  @Column("bit", { name: "IsLatest" })
  isLatest: number;

  @ManyToOne(() => Rolls, (rolls) => rolls.allocations)
  @JoinColumn([{ name: "RollId", referencedColumnName: "rollId" }])
  roll: Rolls;

  @OneToMany(() => Rolls, (rolls) => rolls.lastAllocation)
  rolls: Rolls[];
}
