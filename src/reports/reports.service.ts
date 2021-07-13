import { StockedInRollsWithAllocations } from './../entity/views/StockedInRollsWithAllocations';
import { ChildRolls } from './../entity/views/ChildRolls';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PackingList } from '../entity/models/PackingList';
import { StockSummary } from '../entity/views/StockSummary';
import { StockSummaryToday } from '../entity/views/StockSummaryToday';
import { DateWiseOrders } from '../entity/views/DateWiseOrders';
import { ReadyToWarehouseStockOutRolls } from '../entity/views/ReadyToWarehouseStockOutRolls';
import { ReadyToWarehouseStockInRolls } from '../entity/views/ReadyToWarehouseStockInRolls';
import { StockedInRolls } from '../entity/views/StockedInRolls';
import { StockedOutRolls } from '../entity/views/StockedOutRolls';
import { RollStates } from '../entity/models/RollStates';
import { Tag } from '../entity/models/Tag';
import {
  paginate,
  Pagination,
  IPaginationOptions,
  IPaginationMeta,
} from 'nestjs-typeorm-paginate';
import { CardAssignableRolls } from '../entity/views/CardAssignableRolls';
import { FabricInspectionReadyRolls } from '../entity/views/FabricInspectionReadyRolls';
import { EntityManager, In } from 'typeorm';
import { ReturnAllocatedRolls } from '../entity/views/ReturnAllocatedRolls';
import { CompleteRollInfo } from '../entity/views/CompleteRollInfo';
import { Orders } from '../entity/views/Orders';
import { PackingListCodes } from '../entity/views/PackingListCodes';
import { SuitableRollsToSplit } from '../entity/views/SuitableRollsToSplit';
import ScannerStockSummary from '../entity/dtos/ScannerStockSummary';

@Injectable()
export class ReportsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  getStockSummary(): Promise<StockSummary[]> {
    return this.entityManager.find(StockSummary);
  }

  getStockSummaryToday(): Promise<StockSummaryToday[]> {
    return this.entityManager.find(StockSummaryToday);
  }

  async getServiceStockSummary(limit: number): Promise<ScannerStockSummary> {
    const scannerSummary = new ScannerStockSummary();

    const stockSummaryIn = await this.entityManager.find(StockSummaryToday, {
      RollStateId: 5,
    });

    scannerSummary.StockedInRolls = 0;
    await Promise.all(
      stockSummaryIn.map(
        (summary) => (scannerSummary.StockedInRolls += summary.TotalRolls),
      ),
    );
    scannerSummary.StockedInRolls = Number(scannerSummary.StockedInRolls);

    const stockSummaryOut = await this.entityManager.find(StockSummaryToday, {
      RollStateId: In([8, 9, 10, 11, 12, 13, 14, 15, 16]),
    });

    scannerSummary.StockedOutRolls = 0;
    await Promise.all(
      stockSummaryOut.map(
        (summary) => (scannerSummary.StockedOutRolls += summary.TotalRolls),
      ),
    );
    scannerSummary.StockedOutRolls = Number(scannerSummary.StockedOutRolls);

    scannerSummary.LatestStockInRolls = await this.entityManager.find(
      StockedInRolls,
      {
        where: [{ UpdatedAtDate: new Date().toISOString().slice(0, 10) }],
        order: {
          UpdatedAt: 'DESC',
        },
        skip: 0,
        take: limit,
      },
    );

    scannerSummary.LatestStockOutRolls = await this.entityManager.find(
      StockedOutRolls,
      {
        where: [{ UpdatedAtDate: new Date().toISOString().slice(0, 10) }],
        order: {
          UpdatedAt: 'DESC',
        },
        skip: 0,
        take: limit,
      },
    );
    return scannerSummary;
  }

  getRollStates(): Promise<RollStates[]> {
    return this.entityManager.find(RollStates);
  }

  async getPackingList(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<PackingList>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(PackingList)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<PackingList>(queryBuilder, options);
    }

    return paginate<PackingList>(
      this.entityManager.getRepository(PackingList),
      options,
    );
  }

  async getTag(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<Tag>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(Tag)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<Tag>(queryBuilder, options);
    }

    return paginate<Tag>(
      this.entityManager.getRepository(Tag),
      options,
    );
  }

  async getRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<CompleteRollInfo>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(CompleteRollInfo)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<CompleteRollInfo>(queryBuilder, options);
    }

    // else return everything.
    return paginate<CompleteRollInfo>(
      this.entityManager.getRepository(CompleteRollInfo),
      options,
    );
  }

  async getDateWiseOrders(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<DateWiseOrders>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(DateWiseOrders)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<DateWiseOrders>(queryBuilder, options);
    }

    return paginate<DateWiseOrders>(
      this.entityManager.getRepository(DateWiseOrders),
      options,
    );
  }

  async getReadyToWarehouseStockOutRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<ReadyToWarehouseStockOutRolls>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(ReadyToWarehouseStockOutRolls)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<ReadyToWarehouseStockOutRolls>(queryBuilder, options);
    }

    return paginate<ReadyToWarehouseStockOutRolls>(
      this.entityManager.getRepository(ReadyToWarehouseStockOutRolls),
      options,
    );
  }

  async getReadyToWarehouseStockInRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<ReadyToWarehouseStockInRolls>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(ReadyToWarehouseStockInRolls)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<ReadyToWarehouseStockInRolls>(queryBuilder, options);
    }

    return paginate<ReadyToWarehouseStockInRolls>(
      this.entityManager.getRepository(ReadyToWarehouseStockInRolls),
      options,
    );
  }

  async getStockedInRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<StockedInRolls>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(StockedInRolls)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<StockedInRolls>(queryBuilder, options);
    }

    return paginate<StockedInRolls>(
      this.entityManager.getRepository(StockedInRolls),
      options,
    );
  }

  async getStockedInRollsWithAllocations(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<StockedInRollsWithAllocations>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(StockedInRollsWithAllocations)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<StockedInRollsWithAllocations>(queryBuilder, options);
    }

    return paginate<StockedInRollsWithAllocations>(
      this.entityManager.getRepository(StockedInRollsWithAllocations),
      options,
    );
  }

  async getStockedOutRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<StockedOutRolls>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(StockedOutRolls)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<StockedOutRolls>(queryBuilder, options);
    }

    return paginate<StockedOutRolls>(
      this.entityManager.getRepository(StockedOutRolls),
      options,
    );
  }

  async getLatestTransactionsForRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<CompleteRollInfo>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(CompleteRollInfo)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<CompleteRollInfo>(queryBuilder, options);
    }

    return paginate<CompleteRollInfo>(
      this.entityManager.getRepository(CompleteRollInfo),
      options,
    );
  }

  async getChildRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<ChildRolls>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(ChildRolls)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<ChildRolls>(queryBuilder, options);
    }

    return paginate<ChildRolls>(
      this.entityManager.getRepository(ChildRolls),
      options,
    );
  }

  async getPackingListCodes(
    options: IPaginationOptions<IPaginationMeta>,
    searchBy: string = null,
  ): Promise<Pagination<PackingListCodes>> {
    // search on field otherwise show all results.
    if (searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(PackingListCodes)
        .createQueryBuilder('pl');
      queryBuilder
        .where(
          `cast(pl.[PackingListCode] as nvarchar(16)) like '%${searchBy}%'`,
        )
        .orderBy(`pl.[PackingListCode]`, 'ASC')
        .getMany();
      return paginate<PackingListCodes>(queryBuilder, options);
    }
    return paginate<PackingListCodes>(
      this.entityManager.getRepository(PackingListCodes),
      options,
    );
  }

  async getOrders(
    options: IPaginationOptions<IPaginationMeta>,
    searchBy: string = null,
  ): Promise<Pagination<Orders>> {
    // search on field otherwise show all results.
    if (searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(Orders)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[Order] like '%${searchBy}%'`)
        .orderBy(`pl.[Order]`, 'ASC')
        .getMany();
      return paginate<Orders>(queryBuilder, options);
    }
    return paginate<Orders>(this.entityManager.getRepository(Orders), options);
  }

  async getWarehouseReturnPendingApprovalRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<ReturnAllocatedRolls>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(ReturnAllocatedRolls)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<ReturnAllocatedRolls>(queryBuilder, options);
    }
    return paginate<ReturnAllocatedRolls>(
      this.entityManager.getRepository(ReturnAllocatedRolls),
      options,
    );
  }

  async getSuitableRollsToSplit(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<SuitableRollsToSplit>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(SuitableRollsToSplit)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<SuitableRollsToSplit>(queryBuilder, options);
    }
    return paginate<SuitableRollsToSplit>(
      this.entityManager.getRepository(SuitableRollsToSplit),
      options,
    );
  }

  async getLatestTransactionsForRollId(
    storedRollId: number,
  ): Promise<CompleteRollInfo[]> {
    return this.entityManager.getRepository(CompleteRollInfo).find({
      RollId: storedRollId,
    });
  }

  async getCardsAssignableRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<CardAssignableRolls>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(CardAssignableRolls)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<CardAssignableRolls>(queryBuilder, options);
    }

    return paginate<CardAssignableRolls>(
      this.entityManager.getRepository(CardAssignableRolls),
      options,
    );
  }

  async getFabricInspectionRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<FabricInspectionReadyRolls>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(FabricInspectionReadyRolls)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<FabricInspectionReadyRolls>(queryBuilder, options);
    }

    return paginate<FabricInspectionReadyRolls>(
      this.entityManager.getRepository(FabricInspectionReadyRolls),
      options,
    );
  }

  async getReturnAllocatedRolls(
    options: IPaginationOptions<IPaginationMeta>,
    searchOn: string = null,
    searchBy: string = null,
  ): Promise<Pagination<ReturnAllocatedRolls>> {
    // search on field otherwise show all results.
    if (searchOn != null && searchBy != null) {
      const queryBuilder = this.entityManager
        .getRepository(ReturnAllocatedRolls)
        .createQueryBuilder('pl');
      queryBuilder
        .where(`pl.[${searchOn}] like '%${searchBy}%'`)
        .orderBy(`pl.[${searchOn}]`, 'DESC')
        .getMany();
      return paginate<ReturnAllocatedRolls>(queryBuilder, options);
    }

    return paginate<ReturnAllocatedRolls>(
      this.entityManager.getRepository(ReturnAllocatedRolls),
      options,
    );
  }
}
