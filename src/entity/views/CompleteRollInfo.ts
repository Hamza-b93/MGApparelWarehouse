import { Column, ViewEntity } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_Rolls',
})
export class CompleteRollInfo {
  @Column()
  RollId: number;

  @Column({
    type: 'datetime',
  })
  CreatedAt: Date;

  @Column({
    type: 'datetime',
  })
  UpdatedAt: Date;

  @Column({
    type: 'date',
  })
  UpdatedAtDate: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  NetWeight: number;

  @Column({
    type: 'int',
  })
  ParentRollId: number;

  @Column({
    type: 'smallint',
  })
  IsChildRoll: number;

  @Column({
    type: 'bit',
  })
  IsFresh: number;

  @Column({
    type: 'nvarchar',
    length: 16,
  })
  GeneratedAt: string;

  @Column({
    type: 'smallint',
  })
  IsCardAssigned: number;

  @Column({
    type: 'datetime',
  })
  CardAssignmentTimestamp: Date;

  @Column({
    type: 'nvarchar',
    length: 16,
  })
  TransactionAt: string;

  @Column({
    type: 'int',
  })
  LastAllocationId: number;

  @Column({
    type: 'int',
  })
  ActivityId: number;

  @Column({
    type: 'datetime',
  })
  ActivityRollAssignmentTimestamp: Date;

  @Column({
    type: 'nvarchar',
    length: 16,
  })
  RackLocatorBin: string;

  @Column({
    type: 'bit',
  })
  IsTransactionManual: number;

  @Column({
    type: 'smallint',
  })
  Antenna: number;

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
    type: 'nvarchar',
    length: 32,
  })
  LocationCategory: string;

  @Column({
    type: 'int',
  })
  PackingListId: number;

  @Column({
    type: 'date',
  })
  UploadDate: Date;

  @Column({
    type: 'int',
  })
  PackingListCode: number;

  // @Column({
  //   type: 'decimal',
  //   precision: 10,
  //   scale: 4,
  // })
  // UploadedWeight: number;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  Order: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 64,
  // })
  // FabricContent: string;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  FabricType: string;

  @Column({
    type: 'nvarchar',
    length: 128,
  })
  Color: string;

  @Column({
    type: 'nvarchar',
    length: 32,
  })
  Lot: string;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  FabricConstruction: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  FabricWidth: number;

  // @Column({
  //   type: 'decimal',
  //   precision: 10,
  //   scale: 4,
  // })
  // FabricLength: number;

  // @Column({
  //   type: 'nvarchar',
  //   length: 8,
  // })
  // Pieces: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 8,
  // })
  // ItemCode: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 64,
  // })
  // ItemDescription: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 8,
  // })
  // Igp: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 16,
  // })
  // IgpDate: string;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  Customer: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 32,
  // })
  // CustomerCode: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 32,
  // })
  // Dcn: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 32,
  // })
  // Supplier: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 8,
  // })
  // YarnLot: string;

  @Column({
    type: 'nvarchar',
    length: 8,
  })
  GSM: string;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  Supplier: string;

  @Column({
    type: 'nvarchar',
    length: 16,
  })
  SupplierLot: string;

  @Column({
    type: 'nvarchar',
    length: 16,
  })
  SupplierRollId: string;

  // @Column({
  //   type: 'int',
  // })
  // TransactionType: number;

  @Column({
    type: 'smallint',
  })
  ForSampling: number;
}
