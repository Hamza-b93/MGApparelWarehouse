import { Column, ViewEntity } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_Orders',
})
export class Orders {
  @Column({
    type: 'nvarchar',
    length: 64,
  })
  Order: string;

  @Column({
    type: 'bigint',
  })
  TotalRolls: number;
}
