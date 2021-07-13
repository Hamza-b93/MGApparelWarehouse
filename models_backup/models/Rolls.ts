import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Allocations } from "./Allocations";
import { PackingList } from "./PackingList";

@Index("ClusteredIndex-20210507-104751", ["rollId"], { unique: true })
@Index(
  "NonClusteredIndex-20210507-104804",
  ["isCardAssigned", "cardAssignmentTimestamp", "rollStateId", "rollId"],
  { unique: true }
)
@Index("NonClusteredIndex-20210507-110417", ["netWeight", "rollId"], {
  unique: true,
})
@Index(
  "NonClusteredIndex-20210507-112116",
  ["activityId", "activityRollAssignmentTimestamp", "rollId"],
  { unique: true }
)
@Index("Rolls_pk", ["rollId"], { unique: true })
@Index("Rolls_RollId_uindex", ["rollId"], { unique: true })
@Entity("Rolls", { schema: "Essentials" })
export class Rolls {
  @PrimaryGeneratedColumn({ type: "int", name: "RollId" })
  rollId: number;

  @Column("datetime", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime", { name: "UpdatedAt", default: () => "getdate()" })
  updatedAt: Date;

  @Column("date", { name: "UpdatedAtDate", default: () => "getdate()" })
  updatedAtDate: Date;

  @Column("decimal", { name: "NetWeight", precision: 10, scale: 4 })
  netWeight: number;

  @Column("decimal", { name: "NetLength", precision: 10, scale: 4 })
  netLength: number;

  @Column("int", { name: "ParentRollId", nullable: true })
  parentRollId: number | null;

  @Column("smallint", { name: "IsChildRoll", default: () => "(0)" })
  isChildRoll: number;

  @Column("int", { name: "RollStateId" })
  rollStateId: number;

  @Column("bit", { name: "IsFresh" })
  isFresh: boolean;

  @Column("nvarchar", {
    name: "GeneratedAt",
    nullable: true,
    length: 16,
    default: () => "NULL",
  })
  generatedAt: string | null;

  @Column("smallint", {
    name: "IsCardAssigned",
    nullable: true,
    default: () => "(0)",
  })
  isCardAssigned: number | null;

  @Column("datetime", {
    name: "CardAssignmentTimestamp",
    nullable: true,
    default: () => "NULL",
  })
  cardAssignmentTimestamp: Date | null;

  @Column("nvarchar", { name: "TransactionAt", nullable: true, length: 16 })
  transactionAt: string | null;

  @Column("int", { name: "ActivityId", nullable: true, default: () => "NULL" })
  activityId: number | null;

  @Column("datetime", {
    name: "ActivityRollAssignmentTimestamp",
    nullable: true,
    default: () => "NULL",
  })
  activityRollAssignmentTimestamp: Date | null;

  @Column("nvarchar", {
    name: "RackLocatorBin",
    nullable: true,
    length: 16,
    default: () => "NULL",
  })
  rackLocatorBin: string | null;

  @Column("bit", { name: "IsTransactionManual", default: () => "(0)" })
  isTransactionManual: boolean;

  @Column("smallint", {
    name: "Antenna",
    nullable: true,
    default: () => "NULL",
  })
  antenna: number | null;

  @OneToMany(() => Allocations, (allocations) => allocations.roll)
  allocations: Allocations[];

  @ManyToOne(() => PackingList, (packingList) => packingList.rolls)
  @JoinColumn([
    { name: "PackingListId", referencedColumnName: "packingListId" },
  ])
  packingListId: PackingList;

  @ManyToOne(() => Allocations, (allocations) => allocations.rolls)
  @JoinColumn([
    { name: "LastAllocationId", referencedColumnName: "allocationId" },
  ])
  lastAllocation: Allocations;
}
