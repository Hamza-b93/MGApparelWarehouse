import { Column, ViewEntity, PrimaryColumn } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_ReturnAllocatedRolls',
})
export class ReturnAllocatedRolls {
  @PrimaryColumn({
    type: 'int',
  })
  RollId: number;

  @Column({
    type: 'int',
  })
  PackingListId: number;

  @Column({
    type: 'int',
  })
  ParentRollId: number;

  @Column({
    type: 'int',
  })
  IsCardAssigned: number;

  @Column({
    type: 'datetime',
  })
  CardAssignmentTimestamp: Date;

  @Column({
    type: 'int',
  })
  RollStateId: number;

  @Column({
    type: 'nvarchar',
    length: 32,
  })
  RollState: string;

  @Column({
    type: 'int',
  })
  LastAllocationId: number;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  Order: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  NetWeight: number;

  // @Column({
  //   type: 'nvarchar',
  //   length: 128,
  // })
  // FabricColor: string;
  //
  // @Column({
  //   type: 'nvarchar',
  //   length: 64,
  // })
  // FabricType: string;
  //
  // @Column({
  //   type: 'nvarchar',
  //   length: 32,
  // })
  // FabricLot: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 64,
  // })
  // Supplier: string;
  //
  // @Column({
  //   type: 'nvarchar',
  //   length: 16,
  // })
  // SupplierLot: string;
}
