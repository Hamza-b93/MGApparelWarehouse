import { Column, ViewEntity } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_DateWiseOrders',
})
export class DateWiseOrders {
  @Column({
    type: 'date',
  })
  UploadDate: Date;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  Order: string;

  @Column({
    type: 'nvarchar',
    length: 32,
  })
  Dcn: string;

  @Column({
    type: 'bigint',
  })
  TotalRolls: number;
}
