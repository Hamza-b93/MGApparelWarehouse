import { Column, ViewEntity, PrimaryColumn } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_LatestRollAllocations',
})
export class LatestRollAllocations {
  @PrimaryColumn()
  AllocationId: number;

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
    type: 'int',
  })
  RollId: number;

  @Column({
    type: 'nvarchar',
    length: 8,
  })
  AllocationStatus: string;

  @Column({
    type: 'nvarchar',
    length: 32,
  })
  AllocatedTo: string;
}
