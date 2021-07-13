import { Column, ViewEntity } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_StockedInRolls',
})
export class StockedInRolls {
  @Column({
    type: 'int',
  })
  RollId: number;

  @Column({
    type: 'datetime',
  })
  UpdatedAt: Date;

  @Column({
    type: 'date',
  })
  UpdatedAtDate: Date;

  @Column({
    type: 'int',
  })
  PackingListId: number;

  @Column({
    type: 'int',
  })
  ParentRollId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  NetWeight: number;

  @Column({
    type: 'nvarchar',
    length: 16,
  })
  RackLocatorBin: string;

  @Column({
    type: 'int',
  })
  LastAllocationId: number;

  @Column({
    type: 'int',
  })
  IsCardAssigned: number;

  @Column({
    type: 'int',
  })
  IsChildRoll: number;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  Order: string;

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

  // @Column({
  //   type: 'nvarchar',
  //   length: 16,
  // })
  // SupplierLot: string;
}
