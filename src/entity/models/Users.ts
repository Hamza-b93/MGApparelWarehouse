import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("ClusteredIndex-20210507-111606", ["userId"], { unique: true })
@Index(
  "NonClusteredIndex-20210507-111613",
  ["userName", "userPassword", "userId"],
  { unique: true }
)
@Index("Users_pk", ["userId"], { unique: true })
@Index("Users_UserId_uindex", ["userId"], { unique: true })
@Index("Users_UserName_uindex", ["userName"], { unique: true })
@Entity("Users", { schema: "Essentials" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "UserId" })
  userId: number;

  @Column("datetime", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime", { name: "UpdatedAt", default: () => "getdate()" })
  updatedAt: Date;

  @Column("nvarchar", { name: "UserName", length: 16 })
  userName: string;

  @Column("nvarchar", { name: "UserPassword", length: 8 })
  userPassword: string;
}
