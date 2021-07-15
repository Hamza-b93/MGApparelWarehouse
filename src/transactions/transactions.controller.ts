import {
  Body,
  Controller,
  Post,
  Header,
  Put,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  ParseArrayPipe,
  Delete,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PackingList } from '../entity/models/PackingList';
import VerifyLogin from '../entity/dtos/VerifyLogin';
import ApiResponse from '../entity/dtos/ApiResponse';
import { EntityManager, In, IsNull, Not } from 'typeorm';
import { Users } from '../entity/models/Users';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ErrorsList } from '../entity/models/ErrorsList';
import { CardAssignableRolls } from '../entity/views/CardAssignableRolls';
import { ReadyToWarehouseStockInRolls } from '../entity/views/ReadyToWarehouseStockInRolls';
import { FabricInspectionReadyRolls } from '../entity/views/FabricInspectionReadyRolls';
import { ReadyToWarehouseStockOutRolls } from '../entity/views/ReadyToWarehouseStockOutRolls';
import { SuitableRollsToSplit } from '../entity/views/SuitableRollsToSplit';
import RollSplit from '../entity/dtos/RollSplit';
import AllocatedTo from '../entity/dtos/AllocatedTo';
import { CompleteRollInfo } from '../entity/views/CompleteRollInfo';
import AssignTag from '../entity/dtos/AssignTag';
import WarehouseTransaction from '../entity/dtos/WarehouseTransaction';
import { StockedInRolls } from '../entity/views/StockedInRolls';
import { Allocations } from '../entity/models/Allocations';
import { ReturnAllocatedRolls } from '../entity/views/ReturnAllocatedRolls';
import { Tag } from '../entity/models/Tag';
import ClearAllocation from '../entity/dtos/ClearAllocation';
import UpdateLocation from '../entity/dtos/UpdateLocation';
import UpdateOrder from '../entity/dtos/UpdateOrder';
import FabricInspection from '../entity/dtos/FabricInspection';
import ReturnStock from '../entity/dtos/ReturnStock';

@Controller('api/v1/transactions')
export class TransactionsController {
  // local copy all errors stored in memory to avoid fetching errors from database repeatedly.
  private errorsList: ErrorsList[];

  constructor(
    private readonly transactionsService: TransactionsService,

    @InjectEntityManager()
    private readonly defaultEntityManager: EntityManager,
  ) {}

  // only load errors from database which do not exist.
  private async getError(
    errorId: number,
    data: Record<string, any> = null,
  ): Promise<ApiResponse> {
    // On boot, refresh all records;
    if (!this.errorsList)
      this.errorsList = await this.defaultEntityManager.find(ErrorsList);

    // if error is not found. refresh from database table otherwise throw an error.
    try {
      // error not found, refresh whole list.
      // also find again in refreshed list.
      let currError = this.errorsList.find((error) => error.errorId == errorId);
      if (!currError) {
        this.errorsList = await this.defaultEntityManager.find(ErrorsList);
        currError = this.errorsList.find((error) => error.errorId == errorId);
      }

      return new ApiResponse(
        currError.errorNumber,
        currError.errorMessage,
        data,
      );
    } catch (ex) {
      return new ApiResponse(-1, 'BAD EXECUTION ERROR. API FAILED.');
    }
  }

  @Put('verify_login')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async verifyLogin(
    @Body() userLogin: VerifyLogin,
  ): Promise<ApiResponse | Users> {
    const verification = await this.transactionsService.VerifyLogin(userLogin);
    if (verification instanceof ApiResponse)
      throw new UnauthorizedException(verification);
    return verification;
  }

  @Post('upload_packinglist')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)

  async uploadPackingList(
    @Body(
      new ParseArrayPipe({
        items: PackingList,
      }),
    )
    toUploadPackingList: PackingList[],
  ): Promise<ApiResponse> {
    try {
    // dcn and vendor/supplier combination cannot repeat if it exists in table.
    // const dcnSupplierList = await this.defaultEntityManager.find(DcnSupplier);
    // const matchFound = toUploadPackingList.find((roll) => {
      // const found = dcnSupplierList.find(
      //   (dcnSupplier) =>
      //     dcnSupplier.Dcn.toUpperCase() == roll.Dcn.toUpperCase() &&
      //     dcnSupplier.Supplier.toUpperCase() == roll.Supplier.toUpperCase(),
      // );
      // if (found) return true;
      // return false;
    // });

      //if any roll has repeated dcn, supplier combination. disregard it.
      // if (matchFound) {
      //   throw new BadRequestException(
      //     toUploadPackingList,
      //     'Bad PackingList. Dcn & Supplier cannot repeat.',
      //   );
      // }

      const uploadStatus = await this.transactionsService.uploadPackingList(
        toUploadPackingList,
      );
      if (uploadStatus.ErrorNumber != 0) {
        //console.log(uploadStatus)
        throw new BadRequestException(
          toUploadPackingList,
          'Bad packing list. Kindly check content of packing list.',
        );
      }
      return this.getError(1);
    } catch (ex) {
      if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(3, ex));
    }
  }

  @Post('upload_tag')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)

  async uploadTag(
    @Body(
      new ParseArrayPipe({
        items: Tag,
      }),
    )
    toUploadTagList: Tag[],
  ): Promise<ApiResponse> {
    try {
      const uploadStatus = await this.transactionsService.uploadTagList(
        toUploadTagList,
      );
      if (uploadStatus.ErrorNumber != 0) {
        //console.log(uploadStatus)
        throw new BadRequestException(
          toUploadTagList,
          'Bad packing list. Kindly check content of packing list.',
        );
      }
      return this.getError(1);
    } catch (ex) {
      if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(3, ex));
    }
  }

  @Put('assign_tag')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async assignTag(
    @Body(
      new ParseArrayPipe({
        items: AssignTag,
      }),
      // tagNo: AssignTag,
      // rollId:
    )
    toAssignTags: AssignTag[],
  ): Promise<ApiResponse[]> {
    try {
      const rollIds = await Promise.all(
        toAssignTags.map((assignTag) => {
          console.log(assignTag);
          return assignTag.RollId;
        }),
      );
      const cardAssignableRolls = await this.defaultEntityManager.findByIds(
        CardAssignableRolls,
        rollIds,
      );

      if (cardAssignableRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid rolls. Not suitable to assign cards.',
            {
              Ids: rollIds,
            },
          ),
        );
      } else if (cardAssignableRolls.length != rollIds.length) {
        const presentIds = await Promise.all(
          cardAssignableRolls.map((roll) => {
            return roll.RollId;
          }),
        );

        // for each roll in present ids.
        // get tag ids for those rolls as well.
        const presentTags = await Promise.all(
            cardAssignableRolls.map(
            (roll) => {
              const rollTag = toAssignTags.find(
                (roll2) => roll2.RollId == roll.RollId
              )
              return rollTag;
            }
          ),
        );

        const assigned = await this.transactionsService.assignCard(
          presentTags
        );
        const absentIds = rollIds.filter((id) => !presentIds.includes(id));
        throw new BadRequestException(
          new ApiResponse(
            HttpStatus.PARTIAL_CONTENT,
            'Missing rolls. Partial assignment executed against found ids.',
            {
              FoundIds: assigned,
              NotFoundIds: absentIds,
            },
          ),
        );
      }

      // for each roll in present ids.
      // get tag ids for those rolls as well.
      const presentTags = await Promise.all(
          cardAssignableRolls.map(
          (roll) => {
            const rollTag = toAssignTags.find(
              (roll2) => roll2.RollId == roll.RollId
            )
            return rollTag;
          }
        ),
      );
      return await this.transactionsService.assignCard(presentTags);
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      } else if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(9, ex));
      console.log(ex);
    }
  }

  // async editTag(
  //   @Body(
  //     new ParseArrayPipe({
  //       items: Tag,
  //     }),
  //   )
  //   toUploadTagList: Tag[],
  // ): Promise<ApiResponse> {
  //   try {
  //     //console.log(Tag);
  //     const uploadStatus = await this.transactionsService.uploadTagList(
  //       toUploadTagList,
  //     );
  //     if (uploadStatus.ErrorNumber != 0) {
  //       throw new BadRequestException(
  //         toUploadTagList,
  //         'Bad tag list. Kindly check content of tag list.',
  //       );
  //     }
  //     return this.getError(1);
  //   } catch (ex) {
  //     if (ex instanceof BadRequestException) {
  //       throw new BadRequestException(ex);
  //     }
  //     throw new InternalServerErrorException(await this.getError(3, ex));
  //   }
  //   console.log(Tag);
  // }

  @Post('stockin')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async stockIn(
    @Body(
      new ParseArrayPipe({
        items: WarehouseTransaction,
      }),
    )
    stockIn: WarehouseTransaction[],
  ): Promise<ApiResponse[] | ApiResponse> {
    try {
      const rollIds = await Promise.all(stockIn.map((roll) => roll.rollId));
      const toStockInRolls = await this.defaultEntityManager.find(
        ReadyToWarehouseStockInRolls,
        {
          where: [
            {
              RollId: In(rollIds),
              LastAllocationId: IsNull(),
            },
            {
              RollId: In(rollIds),
              RollStateId: 2,
            },
          ],
        },
      );
console.log(toStockInRolls);
      if (toStockInRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for stocking in.',
            stockIn,
          ),
        );
      }

      const cardAssignedRolls = toStockInRolls.filter(
        (roll) => roll.RollStateId == 2,
      );

      const returningRolls = toStockInRolls.filter(
        (roll) => roll.RollStateId != 2,
      );

      let stockedInCardAssignedRolls: ApiResponse = null;
      let returnedRolls: ApiResponse = null;
      if (cardAssignedRolls.length > 0) {
        const rollIds = cardAssignedRolls.map((roll) => roll.RollId);
        const toStockInCardAssignedRolls = stockIn.filter((roll) =>
          rollIds.includes(roll.rollId),
        );

        stockedInCardAssignedRolls =
          await this.transactionsService.stockInCardAssigned(
            toStockInCardAssignedRolls,
          );
      }

      if (returningRolls.length > 0) {
        const rollIds = returningRolls.map((roll) => roll.RollId);
        const toReturningRolls = stockIn.filter((roll) =>
          rollIds.includes(roll.rollId),
        );
        console.log(toReturningRolls);
        returnedRolls = await this.transactionsService.stockInAllocation(
          toReturningRolls,
        );
      }

  //     // if any of one type or rolls are received, handle response accordingly.
      if ((stockedInCardAssignedRolls ?? false) && (returnedRolls ?? false))
        return [stockedInCardAssignedRolls, returnedRolls];
      else if (stockedInCardAssignedRolls ?? false)
        return stockedInCardAssignedRolls;
      return returnedRolls;
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      }
      throw new InternalServerErrorException(await this.getError(5, ex));
    }
  }

  @Post('stockin_allocation_execution')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async returnStock(
    @Body(
      new ParseArrayPipe({
        items: ReturnStock,
      }),
    )
    returnStock: ReturnStock[],
  ): Promise<ApiResponse> {
    try {
      const rollIds = await Promise.all(returnStock.map((roll) => roll.RollId));
      const toStockInRolls = await this.defaultEntityManager.find(
        ReadyToWarehouseStockInRolls,
        {
          RollId: In(rollIds),
          LastAllocationId: Not(IsNull()),
          RollStateId: In([8, 10, 12, 14]),
        },
      );
      console.log(rollIds);
      console.log(toStockInRolls);

      if (toStockInRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for returning to stock.',
            returnStock,
          ),
        );
      }

  //     // filter out rolls which have been found out from above request.
      const rollIds2 = toStockInRolls.map((roll) => roll.RollId);
      const toReturningRolls = returnStock.filter((roll) =>
        rollIds2.includes(roll.RollId),
      );

      return await this.transactionsService.returnStock(toReturningRolls);
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      }
      throw new InternalServerErrorException(await this.getError(6, ex));
    }
  }

  @Post('fabric_inspection')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async fabricInspection(
    @Body(
      new ParseArrayPipe({
        items: FabricInspection,
      }),
    )
    fabricInspection: FabricInspection[],
  ): Promise<ApiResponse> {
    try {
      const rollIds = await Promise.all(
        fabricInspection.map((roll) => roll.RollId),
      );
      const toFabricInspectionRolls = await this.defaultEntityManager.find(
        FabricInspectionReadyRolls,
        {
          RollId: In(rollIds),
        },
      );

      if (toFabricInspectionRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for fabric inspection.',
            fabricInspection,
          ),
        );
      }

  //     // filter out rolls which have been found out from above request.
      const presentIds = toFabricInspectionRolls.map((roll) => roll.RollId);
      const toFabricInspectionRolls2 = fabricInspection.filter((roll) =>
        presentIds.includes(roll.RollId),
      );

      return await this.transactionsService.fabricInspection(
        toFabricInspectionRolls2,
      );
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      }
      throw new InternalServerErrorException(await this.getError(12, ex));
    }
  }

  // // a single roll can have allocations allowed multiple times.
  // // allocation only allowed for rolls which are either card assigned + stocked in or wip of any department.
  // // if same allocation is requested as already present, discard it too.
  @Post('allocation')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async departmentalAllocation(
    @Body(
      new ParseArrayPipe({
        items: AllocatedTo,
      }),
    )
    rollAllocation: AllocatedTo[],
  ): Promise<ApiResponse> {
    try {
      const rollIds = await Promise.all(
        rollAllocation.map((roll) => roll.RollId),
      );

  //     // if rolls are stocked in then allocation can be done to any other department other than warehouse.
  //     // else if rolls are outside WIP then allocation can only be done towards warehouse.
      const allCompleteRolls = await this.defaultEntityManager.find(
        CompleteRollInfo,
        {
          RollId: In(rollIds),
          IsCardAssigned: 1,
          RollStateId: In([5, 8, 10, 12, 14]),
        },
      );

      // last pending allocations, if found.
      const lastAllocations = await this.defaultEntityManager.find(Allocations, {
        rollId: In(rollIds),
        allocationStatus: 'PENDING',
      });

  //     // remove rolls which are allocated to same department as current.
  //     // also remove rolls which have same allocation as already present as requested one.
  //     // and remove rolls which are in other departments WIP and allocation is not towards warehouse.
  //     // also skip for such rolls which have no prior allocation.
      const toAllocateRolls = allCompleteRolls.filter((roll) => {
        const roll2 = rollAllocation.find(
          (roll3) => roll3.RollId == roll.RollId,
        );

        // if roll has no prior allocation, skip its check.
        const lastAllocation = lastAllocations.find(
          (allocation) => allocation.rollId == roll.RollId,
        );

        return (
          !lastAllocation ||
          (roll.LocationCategory != roll2.AllocatedTo &&
            lastAllocation.allocatedTo != roll2.AllocatedTo &&
            ((roll.RollStateId != 5 && roll2.AllocatedTo == 'WAREHOUSE') ||
              (roll.RollStateId == 5 && roll2.AllocatedTo != 'WAREHOUSE')))
        );
      });

      if (toAllocateRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for allocation.',
            rollAllocation,
          ),
        );
      } else if (toAllocateRolls.length < rollAllocation.length) {
  //       // filter out rolls which have been found out from above request.
        const presentIds = toAllocateRolls.map((roll) => roll.RollId);
        const toAllocateRolls2 = rollAllocation.filter((roll) =>
          presentIds.includes(roll.RollId),
        );
        const allocatedRolls =
          await this.transactionsService.departmentalAllocation(
            toAllocateRolls2,
          );

        const absentIds = rollIds.filter((id) => !presentIds.includes(id));
        throw new BadRequestException(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            'Missing Rolls. Some rolls are not available for allocation.',
            {
              FoundIds: allocatedRolls,
              NotFoundIds: absentIds,
            },
          ),
        );
      }

  //     // filter out rolls which have been found out from above request.
      const presentIds = toAllocateRolls.map((roll) => roll.RollId);
      const toAllocateRolls2 = rollAllocation.filter((roll) =>
        presentIds.includes(roll.RollId),
      );

      return await this.transactionsService.departmentalAllocation(
        toAllocateRolls2,
      );
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      } else if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(8, ex));
    }
  }

  @Post('stockout')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async stockOut(
    @Body(
      new ParseArrayPipe({
        items: WarehouseTransaction,
      }),
    )
    stockOut: WarehouseTransaction[],
  ): Promise<ApiResponse> {
    try {
      const rollIds = await Promise.all(stockOut.map((roll) => roll.rollId));
      const allRolls = await this.defaultEntityManager.find(
        ReadyToWarehouseStockOutRolls,
        {
          RollId: In(rollIds),
        },
      );

  //     // remove rolls which are not found.
      const toStockOutRolls = await Promise.all(
        allRolls.filter((roll) => {
          return stockOut.find((roll2) => roll2.rollId == roll.RollId);
        }),
      );
        console.log("To Stockout rolls: " + toStockOutRolls);
      if (toStockOutRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for stocking out.',
            stockOut,
          ),
        );
      } else if (toStockOutRolls.length < stockOut.length) {
        // filter out rolls which have been found out from above request.
        const presentIds = toStockOutRolls.map((roll) => roll.RollId);
        const toStockOutRolls2 = stockOut.filter((roll) =>
          presentIds.includes(roll.rollId),
        );
        const stockedOutRolls = await this.transactionsService.stockOut(
          toStockOutRolls2,
        );

        const absentIds = rollIds.filter((id) => !presentIds.includes(id));
        throw new BadRequestException(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            'Missing Rolls. Some rolls are not available for stocking out.',
            {
              FoundIds: stockedOutRolls,
              NotFoundIds: absentIds,
            },
          ),
        );
      }

  //     // filter out rolls which have been found out from above request.
      const presentIds = toStockOutRolls.map((roll) => roll.RollId);
      const toStockOutRolls2 = stockOut.filter((roll) =>
        presentIds.includes(roll.rollId),
      );
      return await this.transactionsService.stockOut(toStockOutRolls2);
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      } else if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(13, ex));
    }
  }

  @Post('roll_split')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async rollSplit(
    @Body(
      new ParseArrayPipe({
        items: RollSplit,
      }),
    )
    rollSplit: RollSplit[],
  ): Promise<ApiResponse> {
    try {
  //     // make sure only cutting, warehouse rolls is passed down to rollSplit method.
      const rollIds = await Promise.all(rollSplit.map((roll) => roll.RollId));
      console.log(rollIds);
      const allRolls = await this.defaultEntityManager.find(
        SuitableRollsToSplit,
        {
          RollId: In(rollIds),
        },
      );

  //     // remove rolls which are not found.
      const toSplitRolls = await Promise.all(
        allRolls.filter((roll) => {
          const splitRoll = rollSplit.find(
            (roll2) => roll2.RollId == roll.RollId,
          );
          return splitRoll.NetLength < roll.NetLength;
        }),
      );

      if (toSplitRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for splitting.',
            rollSplit,
          ),
        );
      } else if (toSplitRolls.length < rollSplit.length) {
  //       // filter out rolls which have been found out from above request.
  //       // also filter out rolls which have split weight >= netweight.
        const presentIds = toSplitRolls.map((roll) => roll.RollId);
        const toSplitRolls2 = rollSplit.filter(
          (roll) =>
            presentIds.includes(roll.RollId) &&
            roll.NetLength <
              toSplitRolls.find((roll2) => roll2.RollId == roll.RollId)
                .NetLength,
        );
        const splittedRolls = await this.transactionsService.rollSplit(
          toSplitRolls2,
        );
        const absentIds = rollIds.filter((id) => !presentIds.includes(id));
        throw new BadRequestException(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            'Missing Rolls. Some rolls are not available for splitting.',
            {
              FoundIds: splittedRolls,
              NotFoundIds: absentIds,
            },
          ),
        );
      }

  //     // filter out rolls which have been found out from above request.
      const presentIds = toSplitRolls.map((roll) => roll.RollId);
      const toSplitRolls2 = rollSplit.filter(
        (roll) =>
          presentIds.includes(roll.RollId) &&
          roll.NetLength <
            toSplitRolls.find((roll2) => roll2.RollId == roll.RollId).NetLength,
      );

      return await this.transactionsService.rollSplit(toSplitRolls2);
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      } else if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(10, ex));
    }
  }

  @Post('roll_split_at_return')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async rollSplitAtReturn(
    @Body(
      new ParseArrayPipe({
        items: RollSplit,
      }),
    )
    rollSplit: RollSplit[],
  ): Promise<ApiResponse> {
    try {
      const rollIds = await Promise.all(rollSplit.map((roll) => roll.RollId));
      const allRolls = await this.defaultEntityManager.find(
        ReturnAllocatedRolls,
        {
          RollId: In(rollIds),
          RollStateId: In([10, 12, 14]), // only allow sampling, training, sewing wip rolls.
        },
      );

  //     // remove rolls which are not found.
      const toSplitRolls = await Promise.all(
        allRolls.filter((roll) =>
          rollSplit.find((roll2) => roll2.RollId == roll.RollId),
        ),
      );

      if (toSplitRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for splitting.',
            rollSplit,
          ),
        );
      } else if (toSplitRolls.length < rollSplit.length) {
        // filter out rolls which have been found out from above request.
        // also filter out rolls which have split weight >= netweight.
        const presentIds = toSplitRolls.map((roll) => roll.RollId);
        const toSplitRolls2 = rollSplit.filter(
          (roll) =>
            presentIds.includes(roll.RollId) &&
            roll.NetLength <
              toSplitRolls.find((roll2) => roll2.RollId == roll.RollId)
                .NetLength,
        );
        const splittedRolls = await this.transactionsService.rollSplit(
          toSplitRolls2,
        );

        const absentIds = rollIds.filter((id) => !presentIds.includes(id));
        throw new BadRequestException(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            'Missing Rolls. Some rolls are not available for splitting.',
            {
              FoundIds: splittedRolls,
              NotFoundIds: absentIds,
            },
          ),
        );
      }

  //     // filter out rolls which have been found out from above request.
      const presentIds = toSplitRolls.map((roll) => roll.RollId);
      const toSplitRolls2 = rollSplit.filter(
        (roll) =>
          presentIds.includes(roll.RollId) &&
          roll.NetLength <
            toSplitRolls.find((roll2) => roll2.RollId == roll.RollId).NetLength,
      );

      return await this.transactionsService.rollSplit(toSplitRolls2);
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      } else if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(10, ex));
    }
  }

  @Put('clear_allocation')
  @Header('Content-type', 'application/json')
  async clearAllocation(
    @Body(
      new ParseArrayPipe({
        items: ClearAllocation,
      }),
    )
    clearLocationRolls: ClearAllocation[],
  ): Promise<ApiResponse> {
    try {
      const rollIds = await Promise.all(
        clearLocationRolls.map((roll) => roll.RollId),
      );
      const allRolls = await this.defaultEntityManager.find(StockedInRolls, {
        RollId: In(rollIds),
      });

      // remove rolls which are not found.
      const toClearLocationRolls = await Promise.all(
        allRolls.filter((roll) =>
          clearLocationRolls.find((roll2) => roll2.RollId == roll.RollId),
        ),
      );

      if (toClearLocationRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for clearing location.',
            clearLocationRolls,
          ),
        );
      } else if (toClearLocationRolls.length < clearLocationRolls.length) {
  //       // filter out rolls which have been found out from above request.
        const presentIds = toClearLocationRolls.map((roll) => roll.RollId);
        const toClearLocationRolls2 = clearLocationRolls.filter((roll) =>
          presentIds.includes(roll.RollId),
        );
        const clearedRolls = await this.transactionsService.clearAllocation(
          toClearLocationRolls2,
        );

        const absentIds = rollIds.filter((id) => !presentIds.includes(id));
        throw new BadRequestException(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            'Missing Rolls. Some rolls are not available for clearing locations.',
            {
              FoundIds: clearedRolls,
              NotFoundIds: absentIds,
            },
          ),
        );
      }

  //     // filter out rolls which have been found out from above request.
      const presentIds = toClearLocationRolls.map((roll) => roll.RollId);
      const toClearLocationRolls2 = clearLocationRolls.filter((roll) =>
        presentIds.includes(roll.RollId),
      );
      return await this.transactionsService.clearAllocation(
        toClearLocationRolls2,
      );
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      } else if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(19, ex));
    }
  }

  @Put('update_location')
  @Header('Content-type', 'application/json')
  async updateLocation(
    @Body(
      new ParseArrayPipe({
        items: UpdateLocation,
      }),
    )
    updateLocationRolls: UpdateLocation[],
  ): Promise<ApiResponse> {
    try {
      const rollIds = await Promise.all(
        updateLocationRolls.map((roll) => roll.RollId),
      );
      const allRolls = await this.defaultEntityManager.find(StockedInRolls, {
        RollId: In(rollIds),
      });

  //     // remove rolls which are not found.
      const toUpdateLocationRolls = await Promise.all(
        allRolls.filter((roll) =>
          updateLocationRolls.find((roll2) => roll2.RollId == roll.RollId),
        ),
      );

      if (toUpdateLocationRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for updating location.',
            updateLocationRolls,
          ),
        );
      } else if (toUpdateLocationRolls.length < updateLocationRolls.length) {
        // filter out rolls which have been found out from above request.
        const presentIds = toUpdateLocationRolls.map((roll) => roll.RollId);
        const toUpdateLocationRolls2 = updateLocationRolls.filter((roll) =>
          presentIds.includes(roll.RollId),
        );
        const updatedRolls = await this.transactionsService.updateLocation(
          toUpdateLocationRolls2,
        );

        const absentIds = rollIds.filter((id) => !presentIds.includes(id));
        throw new BadRequestException(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            'Missing Rolls. Some rolls are not available for updating locations.',
            {
              FoundIds: updatedRolls,
              NotFoundIds: absentIds,
            },
          ),
        );
      }
  //
  //     // filter out rolls which have been found out from above request.
      const presentIds = toUpdateLocationRolls.map((roll) => roll.RollId);
      const toUpdateLocationRolls2 = updateLocationRolls.filter((roll) =>
        presentIds.includes(roll.RollId),
      );
      return await this.transactionsService.updateLocation(
        toUpdateLocationRolls2,
      );
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      } else if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(14, ex));
    }
  }
  //
  @Put('update_order')
  @Header('Content-type', 'application/json')
  async updateOrder(
    @Body(
      new ParseArrayPipe({
        items: UpdateOrder,
      }),
    )
    updateOrderRolls: UpdateOrder[],
  ): Promise<ApiResponse> {
    try {
      const rollIds = await Promise.all(
        updateOrderRolls.map((roll) => roll.RollId),
      );
      const allRolls = await this.defaultEntityManager.find(StockedInRolls, {
        RollId: In(rollIds),
      });
  //
  //     // remove rolls which are not found.
      const toUpdateOrderRolls = await Promise.all(
        allRolls.filter((roll) =>
          updateOrderRolls.find((roll2) => roll2.RollId == roll.RollId),
        ),
      );
        console.log("ARRAY IS: " + toUpdateOrderRolls);
      if (toUpdateOrderRolls.length == 0) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. Rolls are not available for updating order.',
            updateOrderRolls,
          ),
        );
      } else if (toUpdateOrderRolls.length < updateOrderRolls.length) {
        // filter out rolls which have been found out from above request.
        const presentIds = toUpdateOrderRolls.map((roll) => roll.RollId);
        const toUpdateOrderRolls2 = updateOrderRolls.filter((roll) =>
          presentIds.includes(roll.RollId),
        );
        const updatedRolls = await this.transactionsService.updateOrder(
          toUpdateOrderRolls2,
        );

        const absentIds = rollIds.filter((id) => !presentIds.includes(id));
        throw new BadRequestException(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            'Missing Rolls. Some rolls are not available for updating order.',
            {
              FoundIds: updatedRolls,
              NotFoundIds: absentIds,
            },
          ),
        );
      }

      // filter out rolls which have been found out from above request.
      const presentIds = toUpdateOrderRolls.map((roll) => roll.RollId);
      const toUpdateOrderRolls2 = updateOrderRolls.filter((roll) =>
        presentIds.includes(roll.RollId),
      );
      return await this.transactionsService.updateOrder(toUpdateOrderRolls2);
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      } else if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(15, ex));
    }
  }

  @Delete('delete_packinglist')
  @Header('Content-type', 'application/json')
  async deletePackingList(
    @Body('PackingListCode') packingListCode: number,
  ): Promise<ApiResponse> {
    try {
      // check if rolls with given packing list code exists.
      // if not return not found exception.
      await this.defaultEntityManager.findOneOrFail(PackingList, {
        packingListId: packingListCode,
      });

      const afterRemoval = await this.transactionsService.deletePackingList(
        packingListCode,
      );

      if (afterRemoval.ErrorNumber != 0)
        throw new BadRequestException(afterRemoval, afterRemoval.ErrorMessage);
      return afterRemoval;
    } catch (ex) {
      if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(20));
    }
  }
}
