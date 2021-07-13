import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Rolls } from "./Rolls";

@Index("ClusteredIndex-20210507-111419", ["packingListId"], { unique: true })
@Index("PackingList_PackingListID_uindex", ["packingListId"], { unique: true })
@Index("PackingList_pk", ["packingListId"], { unique: true })
@Index("PackingList_RollCode_uindex", ["rollCode"], { unique: true })
@Entity("PackingList", { schema: "Essentials" })
export class PackingList {
  @PrimaryGeneratedColumn({ type: "int", name: "PackingListId" })
  packingListId: number;

  @Column("datetime", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime", { name: "UpdatedAt", default: () => "getdate()" })
  updatedAt: Date;

  @Column("date", { name: "UploadDate", default: () => "getdate()" })
  uploadDate: Date;

  @Column("nvarchar", { name: "Order", length: 64 })
  order: string;

  @Column("nvarchar", { name: "Article", length: 64 })
  article: string;

  @Column("nvarchar", { name: "RollCode", length: 16 })
  rollCode: string;

  @Column("decimal", { name: "UploadedLength", precision: 10, scale: 4 })
  uploadedLength: number;

  @Column("decimal", { name: "RollWeight", precision: 10, scale: 4 })
  rollWeight: number;

  @Column("nvarchar", { name: "Color", length: 64 })
  color: string;

  @Column("nvarchar", { name: "Lot", length: 64 })
  lot: string;

  @Column("nvarchar", { name: "InvoiceNo", length: 64 })
  invoiceNo: string;

  @Column("nvarchar", {
    name: "FabricConstruction",
    nullable: true,
    length: 32,
  })
  fabricConstruction: string | null;

  @Column("nvarchar", { name: "Shade", nullable: true, length: 32 })
  shade: string | null;

  @Column("nvarchar", { name: "ReceiptNo", nullable: true, length: 16 })
  receiptNo: string | null;

  @Column("date", { name: "ReceiptDate", nullable: true })
  receiptDate: Date | null;

  @Column("nvarchar", { name: "PRNo", nullable: true, length: 16 })
  prNo: string | null;

  @Column("date", { name: "PRDate", nullable: true })
  prDate: Date | null;

  @Column("nvarchar", { name: "GatePassNo", nullable: true, length: 16 })
  gatePassNo: string | null;

  @Column("nvarchar", { name: "PO", nullable: true, length: 64 })
  po: string | null;

  @Column("date", { name: "PODate", nullable: true })
  poDate: Date | null;

  @Column("nvarchar", { name: "InspectionNo", nullable: true, length: 32 })
  inspectionNo: string | null;

  @Column("nvarchar", { name: "BiltyNo", nullable: true, length: 16 })
  biltyNo: string | null;

  @Column("nvarchar", { name: "DO", nullable: true, length: 16 })
  do: string | null;

  @Column("nvarchar", { name: "DriverName", nullable: true, length: 32 })
  driverName: string | null;

  @Column("nvarchar", { name: "VehicleNo", nullable: true, length: 16 })
  vehicleNo: string | null;

  @OneToMany(() => Rolls, (rolls) => rolls.packingListId)
  rolls: Rolls[];
}
