import { Column, ViewEntity, PrimaryColumn } from 'typeorm';

@ViewEntity({
  schema: 'Api',
  name: 'vw_PendingActivities',
})
export class PendingActivity {
  @PrimaryColumn()
  ActivityId: number;

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
    type: 'datetime',
  })
  StartTime: Date;

  @Column({
    type: 'datetime',
  })
  EndTime: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  SmallWaste: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  LargeWaste: number;

  @Column({
    type: 'nvarchar',
    length: 8,
  })
  Shift: string;
}
