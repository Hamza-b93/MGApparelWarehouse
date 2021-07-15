import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";


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
}
