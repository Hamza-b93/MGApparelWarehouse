import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Rolls } from "./Rolls";

@Index("PK_TagID", ["tagId"], { unique: true })
@Entity("Tag", { schema: "Essentials" })
export class Tag {
  @PrimaryGeneratedColumn({ type: "int", name: "TagID" })
  tagId: number;

  @Column("datetimeoffset", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetimeoffset", { name: "UpdatedAt", default: () => "getdate()" })
  updatedAt: Date;

  @Column({ type: "int", name: "RollID" })
  rollId: number;
}
