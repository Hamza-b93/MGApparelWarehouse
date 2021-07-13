import { Column, ViewEntity } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_StockSummaryToday',
})
export class StockSummaryToday {
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
    type: 'decimal',
    precision: 38,
    scale: 4,
  })
  TotalWeight: number;

  @Column({
    type: 'bigint',
  })
  TotalRolls: number;
}
