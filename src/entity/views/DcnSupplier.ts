import { Column, ViewEntity } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_DcnSupplier',
})
export class DcnSupplier {
  @Column({
    type: 'nvarchar',
    length: 32,
  })
  Dcn: string;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  Supplier: string;

  @Column({
    type: 'bigint',
  })
  TotalRolls: number;
}
