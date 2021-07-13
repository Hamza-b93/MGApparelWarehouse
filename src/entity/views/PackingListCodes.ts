import { Column, ViewEntity } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_PackingListCodes',
})
export class PackingListCodes {
  @Column({
    type: 'int',
  })
  PackingListCode: number;

  @Column({
    type: 'bigint',
  })
  TotalRolls: number;
}
