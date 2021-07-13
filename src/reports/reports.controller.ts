import { StockedInRollsWithAllocations } from './../entity/views/StockedInRollsWithAllocations';
import { ChildRolls } from './../entity/views/ChildRolls';
import { StockSummary } from '../entity/views/StockSummary';
import { ReportsService } from './reports.service';
import { Controller, Get, ParseIntPipe, Query, Param } from '@nestjs/common';
import { PackingList } from '../entity/models/PackingList';
import { DateWiseOrders } from '../entity/views/DateWiseOrders';
import { StockSummaryToday } from '../entity/views/StockSummaryToday';
import { ReadyToWarehouseStockOutRolls } from '../entity/views/ReadyToWarehouseStockOutRolls';
import { ReadyToWarehouseStockInRolls } from '../entity/views/ReadyToWarehouseStockInRolls';
import { StockedInRolls } from '../entity/views/StockedInRolls';
import { StockedOutRolls } from '../entity/views/StockedOutRolls';
import { RollStates } from '../entity/models/RollStates';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Rolls } from '../entity/models/Rolls';
import { CardAssignableRolls } from '../entity/views/CardAssignableRolls';
import { FabricInspectionReadyRolls } from '../entity/views/FabricInspectionReadyRolls';
import { ReturnAllocatedRolls } from '../entity/views/ReturnAllocatedRolls';
import { CompleteRollInfo } from '../entity/views/CompleteRollInfo';
import { PackingListCodes } from '../entity/views/PackingListCodes';
import { Orders } from '../entity/views/Orders';
import { SuitableRollsToSplit } from '../entity/views/SuitableRollsToSplit';
import ScannerStockSummary from '../entity/dtos/ScannerStockSummary';
import { Tag } from '../entity/models/Tag';
import {getManager, getRepository} from "typeorm";

@Controller('api/v1/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('stock_summary')
  getStockSummary(): Promise<StockSummary[]> {
    return this.reportsService.getStockSummary();
  }

  @Get('stock_summary_today')
  getStockSummaryToday(): Promise<StockSummaryToday[]> {
    return this.reportsService.getStockSummaryToday();
  }

  @Get('service_stock_summary')
  getServiceStockSummary(
    @Query('limit', ParseIntPipe) limit = 10,
  ): Promise<ScannerStockSummary> {
    return this.reportsService.getServiceStockSummary(limit);
  }

  @Get('packinglist')
  async getPackingList(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<PackingList>> {
    return this.reportsService.getPackingList(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('tag')
  async getTag(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<Tag>> {
    return this.reportsService.getTag(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('rolls')
  async getRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<CompleteRollInfo>> {
    return this.reportsService.getRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('datewise_orders')
  async getDateWiseOrders(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<DateWiseOrders>> {
    return this.reportsService.getDateWiseOrders(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('ready_to_stockout_rolls')
  async getReadyToWarehouseStockOutRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<ReadyToWarehouseStockOutRolls>> {
    return this.reportsService.getReadyToWarehouseStockOutRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('ready_to_stockin_rolls')
  async getReadyToWarehouseStockInRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<ReadyToWarehouseStockInRolls>> {
    return this.reportsService.getReadyToWarehouseStockInRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('stockedin_rolls')
  async getStockedInRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<StockedInRolls>> {
    return this.reportsService.getStockedInRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('stockedin_rolls_with_allocations')
  async getStockedInRollsWithAllocations(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<StockedInRollsWithAllocations>> {
    return this.reportsService.getStockedInRollsWithAllocations(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('stockedout_rolls')
  async getStockedOutRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<StockedOutRolls>> {
    return this.reportsService.getStockedOutRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('packinglist_codes')
  async getPackingListCodes(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<PackingListCodes>> {
    return this.reportsService.getPackingListCodes(
      {
        page,
        limit,
      },
      searchBy,
    );
  }

  @Get('roll_states')
  async getRollStates(): Promise<RollStates[]> {
    return this.reportsService.getRollStates();
  }

  @Get('latest_transactions_for_rolls')
  async getLatestTransactionsForRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 11,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<CompleteRollInfo>> {
    return this.reportsService.getLatestTransactionsForRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
    console.log(searchBy);
  }

  @Get('child_rolls')
  async getChildRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<ChildRolls>> {
    return this.reportsService.getChildRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('orders')
  async getOrders(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<Orders>> {
    return this.reportsService.getOrders(
      {
        page,
        limit,
      },
      searchBy,
    );
  }

  @Get('warehouse_return_pending_approval_rolls')
  async getWarehouseReturnPendingApprovalRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<ReturnAllocatedRolls>> {
    return this.reportsService.getWarehouseReturnPendingApprovalRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('suitable_rolls_to_split')
  async getSuitableRollsToSplit(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<SuitableRollsToSplit>> {
    return this.reportsService.getSuitableRollsToSplit(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('latest_transactions_for_rollid')
  async getAll(@Query("tagId") tagId: number) {
      return getRepository(Tag).findOne(tagId);
      const result = await getRepository(Tag).findOne(tagId);
      console.log(result);
      console.log(result.rollId);
      const storedRollId = result.rollId;
      console.log(storedRollId);
      const newResult = await getRepository(Rolls).findOne(storedRollId);
      //if (newResult.length === 0){
        //return "Data does not exist!"
      //}
      //else {
        //console.log(newResult);
        //console.log(typeof(newResult));
        return this.reportsService.getLatestTransactionsForRollId(storedRollId);
      //}

      //return newResult;
  // async getLatestTransactionsForRollId(
  //   @Query('rollId', ParseIntPipe) rollId = -1,
  // ): Promise<CompleteRollInfo> {
  //   console.log(rollId);
  //

  }

  // @Get("/test/:id")
  //   async getAll(@Param("id") tagId: number) {
  //       //return getRepository(Tag).findOne(tagId);
  //       const result = await getRepository(Tag).findOne(tagId);
  //       console.log(result);
  //       console.log(result.rollId);
  //       const storedRollId = result.rollId;
  //       console.log(storedRollId);
  //       const newResult = await getRepository(Rolls).findOne(storedRollId);
  //       console.log(newResult);
  //       return newResult;
  //   }

  @Get('cards_assignable_rolls')
  async getCardsAssignableRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<CardAssignableRolls>> {
    return this.reportsService.getCardsAssignableRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('fabric_inspection_ready_rolls')
  async getFabricInspectionReadyRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<FabricInspectionReadyRolls>> {
    return this.reportsService.getFabricInspectionRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }

  @Get('return_allocated_rolls')
  async getReturnAllocatedRolls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('searchOn') searchOn: string = null,
    @Query('searchBy') searchBy: string = null,
  ): Promise<Pagination<ReturnAllocatedRolls>> {
    return this.reportsService.getReturnAllocatedRolls(
      {
        page,
        limit,
      },
      searchOn,
      searchBy,
    );
  }
}
