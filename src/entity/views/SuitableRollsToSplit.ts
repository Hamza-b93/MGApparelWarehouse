import { Column, ViewEntity, PrimaryColumn } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_SuitableRollsToSplit',
})
export class SuitableRollsToSplit {
  @PrimaryColumn({
    type: 'int',
  })
  RollId: number;

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
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  NetLength: number;

  @Column({
    type: 'int',
  })
  PackingListId: number;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  Order: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 64,
  // })
  // Supplier: string;

  // @Column({
  //   type: 'nvarchar',
  //   length: 128,
  // })
  // FabricColor: string;

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
}
