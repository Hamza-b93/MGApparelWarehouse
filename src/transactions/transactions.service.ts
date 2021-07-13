import { LatestRollAllocations } from './../entity/views/LatestRollAllocations';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { PackingList } from '../entity/models/PackingList';
import { Tag } from '../entity/models/Tag';
import { Rolls } from '../entity/models/Rolls';
import { Users } from '../entity/models/Users';
import { CompleteRollInfo } from '../entity/views/CompleteRollInfo';
import VerifyLogin from '../entity/dtos/VerifyLogin';
import ApiResponse from '../entity/dtos/ApiResponse';
import { ErrorsList } from '../entity/models/ErrorsList';
import { Allocations } from '../entity/models/Allocations';
import { RollStates } from '../entity/models/RollStates';
import WarehouseTransaction from '../entity/dtos/WarehouseTransaction';
import { CardAssignableRolls } from '../entity/views/CardAssignableRolls';
import AllocatedTo from '../entity/dtos/AllocatedTo';
import RollSplit from '../entity/dtos/RollSplit';
import ClearAllocation from '../entity/dtos/ClearAllocation';
import UpdateLocation from '../entity/dtos/UpdateLocation';
import UpdateOrder from '../entity/dtos/UpdateOrder';
import FabricInspection from '../entity/dtos/FabricInspection';
import ReturnStock from '../entity/dtos/ReturnStock';
import AssignTag from '../entity/dtos/AssignTag';
import { SuitableRollsToSplit } from '../entity/views/SuitableRollsToSplit';


@Injectable()
export class TransactionsService {
  // local copy all errors stored in memory to avoid fetching errors from database repeatedly.
  private errorsList: ErrorsList[] = null;

  constructor(
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

  // returns a promise, verifies user login information.
  async VerifyLogin(userLogin: VerifyLogin): Promise<ApiResponse | Users> {
    try {
      return await this.defaultEntityManager.findOneOrFail(Users, {
        userName: userLogin.UserName,
        userPassword: userLogin.UserPassword,
      });
    } catch {
      return await this.getError(2, {
        userName: userLogin.UserName,
        userPassword: userLogin.UserPassword,
      });
    }
  }

  // uploads packing list to database.
  // it uploads full packing list or fails in all or nothing manner.
  async uploadPackingList(
    toUploadPackingList: PackingList[],
  ): Promise<ApiResponse> {
    try {
      // uppercase all data from packinglist.
      toUploadPackingList.map((packingList) => {
        packingList.order = packingList.order.toUpperCase();
        packingList.article = packingList.article.toUpperCase();
        packingList.rollCode = packingList.rollCode.toUpperCase();
        // if (packingList.uploadedLength ?? null)
        //   packingList.uploadedLength = packingList.uploadedLength.toUpperCase();
        if (packingList.color ?? null)
          packingList.color = packingList.color.toUpperCase();
        if (packingList.lot ?? null)
          packingList.lot = packingList.lot.toUpperCase();
        // if (packingList.invoiceNo ?? null)
        //   packingList.invoiceNo = packingList.invoiceNo.toUpperCase();
        if (packingList.fabricConstruction ?? null)
          packingList.fabricConstruction = packingList.fabricConstruction.toUpperCase();
        if (packingList.shade ?? null)
          packingList.shade =
            packingList.shade.toUpperCase();
        // if (packingList.receiptNo ?? null)
        //   packingList.receiptNo = packingList.receiptNo.toUpperCase();
        // // if (packingList.receiptDate ?? null)
        // //   packingList.receiptDate = packingList.receiptDate.toUpperCase();
        // if (packingList.prNo ?? null)
        //   packingList.prNo = packingList.prNo.toUpperCase();
        // if (packingList.prDate ?? null)
        // //   packingList.prDate = packingList.prDate.toUpperCase();
        // if (packingList.gatePassNo ?? null)
        //   packingList.gatePassNo = packingList.gatePassNo.toUpperCase();
        // if (packingList.po ?? null)
        //   packingList.po = packingList.po.toUpperCase();
        // if (packingList.inspectionNo ?? null)
        //   packingList.inspectionNo = packingList.inspectionNo.toUpperCase();
        // if (packingList.biltyNo ?? null)
        //   packingList.biltyNo = packingList.biltyNo.toUpperCase();
        if (packingList.do ?? null)
          packingList.do = packingList.do.toUpperCase();
        if (packingList.driverName ?? null)
          packingList.driverName = packingList.driverName.toUpperCase();
        // if (packingList.vehicleNo ?? null)
        //   packingList.vehicleNo = packingList.vehicleNo.toUpperCase();
        // if (packingList.rolls ?? null)
        //   packingList.rolls = packingList.rolls.toUpperCase();
      });

      await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) => {
          const uploadedPackingList = await batchManager.save(
            PackingList,
            toUploadPackingList,
            {
              chunk: 500,
            },
          );

          const toUploadRolls = await Promise.all(
            toUploadPackingList.map((toUpload, index) => {
              const roll = new Rolls();
              roll.netWeight = toUpload.rollWeight;
              roll.netLength = toUpload.uploadedLength;
              //roll.packingListId = toUpload.packingListId;
              roll.rollStateId = 1;
              roll.isFresh = true;
              roll.packingList = uploadedPackingList[index].packingListId;
              // console.log("To Upload: " + toUpload.rollWeight);
              console.log(uploadedPackingList[index]);
              return roll;

            }),
          );

          console.log(toUploadRolls);

          //packingListId: uploadedPackingList.identifiers[index].packingListId,
          await batchManager.save(Rolls, toUploadRolls, {
            chunk: 500,
          });
        },
      );
      return await this.getError(1);
    } catch (ex) {
      return await this.getError(3, ex);
    }
  }

  // uploads tag list to database.
  // it uploads full tag list or fails in all or nothing manner.
  async uploadTagList(
    toUploadTagList: Tag[],
  ): Promise<ApiResponse> {
    try {
      // uppercase all data from packinglist.
      // toUploadPackingList.map((packingList) => {
      //   packingList.order = packingList.order.toUpperCase();
      //   packingList.article = packingList.article.toUpperCase();
      //   packingList.rollCode = packingList.rollCode.toUpperCase();
      //   // if (packingList.uploadedLength ?? null)
      //   //   packingList.uploadedLength = packingList.uploadedLength.toUpperCase();
      //   if (packingList.color ?? null)
      //     packingList.color = packingList.color.toUpperCase();
      //   if (packingList.lot ?? null)
      //     packingList.lot = packingList.lot.toUpperCase();
      //   // if (packingList.invoiceNo ?? null)
      //   //   packingList.invoiceNo = packingList.invoiceNo.toUpperCase();
      //   if (packingList.fabricConstruction ?? null)
      //     packingList.fabricConstruction = packingList.fabricConstruction.toUpperCase();
      //   if (packingList.shade ?? null)
      //     packingList.shade =
      //       packingList.shade.toUpperCase();
      //   // if (packingList.receiptNo ?? null)
      //   //   packingList.receiptNo = packingList.receiptNo.toUpperCase();
      //   // // if (packingList.receiptDate ?? null)
      //   // //   packingList.receiptDate = packingList.receiptDate.toUpperCase();
      //   // if (packingList.prNo ?? null)
      //   //   packingList.prNo = packingList.prNo.toUpperCase();
      //   // if (packingList.prDate ?? null)
      //   // //   packingList.prDate = packingList.prDate.toUpperCase();
      //   // if (packingList.gatePassNo ?? null)
      //   //   packingList.gatePassNo = packingList.gatePassNo.toUpperCase();
      //   // if (packingList.po ?? null)
      //   //   packingList.po = packingList.po.toUpperCase();
      //   // if (packingList.inspectionNo ?? null)
      //   //   packingList.inspectionNo = packingList.inspectionNo.toUpperCase();
      //   // if (packingList.biltyNo ?? null)
      //   //   packingList.biltyNo = packingList.biltyNo.toUpperCase();
      //   if (packingList.do ?? null)
      //     packingList.do = packingList.do.toUpperCase();
      //   if (packingList.driverName ?? null)
      //     packingList.driverName = packingList.driverName.toUpperCase();
      //   // if (packingList.vehicleNo ?? null)
      //   //   packingList.vehicleNo = packingList.vehicleNo.toUpperCase();
      //   // if (packingList.rolls ?? null)
      //   //   packingList.rolls = packingList.rolls.toUpperCase();
      // });

      await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) => {
          const uploadedTagList = await batchManager.save(
            Tag,
            toUploadTagList,
            {
              chunk: 500,
            },
          );
        },
      );
      return await this.getError(1);
    } catch (ex) {
      return await this.getError(3, ex);
    }
  }

  // update card to a given roll.
  // if roll is a child roll, do not change its roll state.
  async assignCard(
    assignTag: AssignTag[]
  ): Promise<ApiResponse[]> {
    const toRoll = {
      isCardAssigned: 1,
      cardAssignmentTimestamp: new Date(),
      updatedAtDate: new Date(),
      rollStateId: 2,
    };

    const toChildRoll = {
      isCardAssigned: 1,
      cardAssignmentTimestamp: new Date(),
      updatedAtDate: new Date(),
    };

    const afterwards = await Promise.allSettled(
      assignTag.map(async (roll) => {
        try {
          const rollInfo = await this.defaultEntityManager.findOneOrFail(
            CompleteRollInfo,
            {
              RollId: roll.RollId,
            }
          );
          this.defaultEntityManager.transaction(
            async (batchManager: EntityManager) => {
              await batchManager.update(
                Rolls,
                roll.RollId,
                rollInfo.IsChildRoll == 0 ? toRoll : toChildRoll,
              );
              // const tag = new Tag();
              // tag.roll = ?
              // tag.tagId = ?
              // batchManager.save(tag);
              await batchManager.update(
                Tag,
                {
                  tagId: roll.TagId,
                },
                {
                  rollId: roll.RollId
                }
              );

              //
            },
          );
          console.log(roll.RollId);
          return await this.getError(1, roll);
        } catch (ex) {
          return await this.getError(9, roll);
        }
      }),
    );

    return Promise.all(
      afterwards.map(async (result) => {
        if (result.status == 'fulfilled') {
          return await this.getError(1, {
            rollId: result.value.Data.rollId,
            netWeight: result.value.Data.netWeight,
            isCardAssigned: 1,
            cardAssignmentTimestamp: new Date(),
          });
        } else {
          return await this.getError(9, result.reason);
        }
      }),
    );
  }
  //
  // // stock in from card assigned.
  // // if roll is sampling dedicated, do not push into fabric inspection,
  // // instead migrate into stock in.
  async stockInCardAssigned(
    toStockInRolls: WarehouseTransaction[],
  ): Promise<ApiResponse> {
    try {
      const rollIds = toStockInRolls.map((roll) => roll.rollId);
      const allRolls = await this.defaultEntityManager.find(Rolls, {
        rollId: In(rollIds),
      });
      const allCompleteRolls = await this.defaultEntityManager.find(
        CompleteRollInfo,
        {
          RollId: In(rollIds),
        },
      );

      const toUpdateRolls = await Promise.all(
        toStockInRolls.map((toStockInRoll) => {
          const currentRoll = allRolls.find(
            (roll) => roll.rollId == toStockInRoll.rollId,
          );

          const currentCompleteRoll = allCompleteRolls.find(
            (roll) => roll.RollId == toStockInRoll.rollId,
          );

  //         // if roll is sampling induced, just stock it in.
          if (currentCompleteRoll.ForSampling == 1) currentRoll.rollStateId = 5;
          else currentRoll.rollStateId = 3;
          currentRoll.transactionAt = 'WAREHOUSE';
          currentRoll.antenna = toStockInRoll.Antenna;
          currentRoll.isTransactionManual = toStockInRoll.IsManual ? true : false;
          currentRoll.activityId = null;
          currentRoll.activityRollAssignmentTimestamp = null;
          currentRoll.rackLocatorBin = null;
          currentRoll.lastAllocation = null;
          currentRoll.updatedAtDate = new Date();
          return currentRoll;
        }),
      );
      const updatedRolls = await this.defaultEntityManager.save(toUpdateRolls, {
        chunk: 500,
      });
      return await this.getError(1, updatedRolls);
    } catch (ex) {
      return await this.getError(9, toStockInRolls);
    }
  }

  // // if roll is returning. do not stock in,
  // // instead map an allocation to warehouse from returning department.
  async stockInAllocation(
    toAllocateRolls: WarehouseTransaction[],
  ): Promise<ApiResponse> {
    try {
      const rollIds: number[] = toAllocateRolls.map((roll) => roll.rollId);
      const allRolls = await this.defaultEntityManager.find(Rolls, {
        rollId: In(rollIds),
      });

      const currentAllocations = await this.defaultEntityManager.find(
        Allocations,
        {
          rollId: In(rollIds),
          isLatest: 1,
        },
      );

  //     // set previous allocations to non-latest.
      currentAllocations.map(
        (allocation) => (
          (allocation.isLatest = 0), (allocation.updatedAtDate = new Date())
        ),
      );
      const rollsAndAllocations = await Promise.all(
        allRolls.map((toAllocateRoll) => {
          const allocation = new Allocations();
          allocation.rollId = toAllocateRoll.rollId;
          allocation.allocationStatus = 'PENDING';
          allocation.allocatedTo = 'WAREHOUSE';
          allocation.isLatest = 1;
          toAllocateRoll.transactionAt = 'WAREHOUSE';
          toAllocateRoll.activityId = null;
          toAllocateRoll.activityRollAssignmentTimestamp = null;
          toAllocateRoll.rackLocatorBin = null;
          toAllocateRoll.lastAllocation = null;
          toAllocateRoll.updatedAtDate = new Date();
          return [allocation, toAllocateRoll];
        }),
      );

      const allocations = rollsAndAllocations.map((ra) => ra[0] as Allocations);
      const changes = await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) => {
          await batchManager.save(currentAllocations);
          const savedAllocations = await batchManager.save(allocations);

          const rolls = await Promise.all(
            rollsAndAllocations.map((ra) => {
              const savedAllocation = savedAllocations.find(
                (allocation) => allocation.rollId == (ra[1] as Rolls).rollId,
              );

  //             // assign last allocation id to roll;
              (ra[1] as Rolls).lastAllocationId = savedAllocation.allocationId;
              return ra[1] as Rolls;
            }),
          );

  //         // save rolls.
          const savedRolls = await batchManager.save(rolls);
          return [savedAllocations, savedRolls];
        },
      );
      return await this.getError(1, changes);
    } catch (ex) {
      return await this.getError(5, toAllocateRolls);
    }
  }

  // // stock in or rejects from return allocation.
  async returnStock(toReturnRolls: ReturnStock[]): Promise<ApiResponse> {
    const rollIds = toReturnRolls.map((roll) => roll.RollId);
    const allRolls = await this.defaultEntityManager.find(Rolls, {
      rollId: In(rollIds),
    });
    console.log(rollIds);

  //   // fetching pending allocations.
    const pendingAllocations = await this.defaultEntityManager.find(
      LatestRollAllocations,
      {
        RollId: In(rollIds),
      },
    );

    const pendingAllocationIds = await Promise.all(
      pendingAllocations.map((allocation) => allocation.AllocationId),
    );

    const allAllocations = await this.defaultEntityManager.find(Allocations, {
      allocationId: In(pendingAllocationIds),
    });

    const changeLog = await Promise.all(
      toReturnRolls.map(async (toReturnRoll) => {
        const currentRoll = allRolls.find(
          (roll) => roll.rollId == toReturnRoll.RollId,
        );

  //       // find all previous pending allocations.
        const currentAllocations = allAllocations.filter(
          (allocation) => allocation.rollId == currentRoll.rollId,
        );

  //       // reject all previous allocations.
        let updatedAllocations = await Promise.all(
          currentAllocations.map((allocation) => {
            allocation.allocationStatus = 'REJECTED';
            allocation.updatedAtDate = new Date();
            return allocation;
          }),
        );

  //       // remove allocation from roll.
  //       // keeping last allocation id saved to be used in if condition.
        const lastAllocation = currentRoll.lastAllocation;
        currentRoll.lastAllocation = null;
        currentRoll.transactionAt = 'WAREHOUSE';
        currentRoll.activityId = null;
        currentRoll.activityRollAssignmentTimestamp = null;
        currentRoll.rackLocatorBin = null;
        currentRoll.isTransactionManual = false;
        currentRoll.antenna = null;
        currentRoll.updatedAtDate = new Date();

  //       // check if stock in is accepted.
        if (toReturnRoll.IsRejected == false) {
          // stock in roll upon accept.
          currentRoll.rollStateId = 5;
          currentRoll.isFresh = false;

  //         // set last allocation of roll to be accepted.
          updatedAllocations = updatedAllocations.map((allocation) => {
            if (allocation.allocationId == lastAllocation.allocationId) {
              allocation.allocationStatus = 'EXECUTED';
              allocation.updatedAt = new Date();
            }
            return allocation;
          });
        }
        return [currentRoll, updatedAllocations];
      }),
    );

    const toUpdateRolls: Rolls[] = await Promise.all(
      changeLog.map((change) => change[0] as Rolls),
    );

    const toUpdateAllocations: Allocations[][] = await Promise.all(
      changeLog.map((change) => change[1] as Allocations[]),
    );

    try {
      const updatedLog = await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) => {
          const updatedRolls = await batchManager.save(toUpdateRolls);
          const updatedAllocations = await Promise.all(
            toUpdateAllocations.map((allocation) =>
              batchManager.save(allocation),
            ),
          );
          return [updatedRolls, updatedAllocations];
        },
      );

      return await this.getError(1, updatedLog);
    } catch (ex) {
      return await this.getError(5, toReturnRolls);
    }
  }

  // // stocks in roll from fabric inspection from accept/reject handheld app.
  // // handles fabric inspection at other departments than warehouse as well.
  async fabricInspection(
    toFabricInspectionRolls: FabricInspection[],
  ): Promise<ApiResponse> {
    const rollIds = toFabricInspectionRolls.map((roll) => roll.RollId);
    const allRolls = await this.defaultEntityManager.find(Rolls, {
      rollId: In(rollIds),
    });

    const allCompleteRolls = await this.defaultEntityManager.find(
      CompleteRollInfo,
      {
        RollId: In(rollIds),
      },
    );

    const toUpdateRolls = await Promise.all(
      toFabricInspectionRolls.map(async (toFabricInspectionRoll) => {
        const currentRoll = allRolls.find(
          (roll) => roll.rollId == toFabricInspectionRoll.RollId,
        );

        const currentCompleteRoll = allCompleteRolls.find(
          (roll) => roll.RollId == toFabricInspectionRoll.RollId,
        );

        // update roll for fabric inspection.
        currentRoll.lastAllocation = null;
        currentRoll.transactionAt =
          currentRoll.rollStateId == 3
            ? 'WAREHOUSE'
            : currentCompleteRoll.LocationCategory;
        currentRoll.activityId = null;
        currentRoll.activityRollAssignmentTimestamp = null;
        currentRoll.rackLocatorBin = null;
        currentRoll.updatedAtDate = new Date();

  //       // if fabric inspection at warehouse then upon accept,
  //       // change roll state id to 5 ie warehouse.
  //       // else at eg at cutting, upon accept do nothing ie keep in cutting wip or any other dept wip.
  //       // upon reject for both cases, move into rejected upon inspection ie roll state id 4.
        if (toFabricInspectionRoll.IsRejected) currentRoll.rollStateId = 4;
        else if (currentRoll.rollStateId == 3) currentRoll.rollStateId = 5;
        return currentRoll;
      }),
    );

    try {
      const changeLog = await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) => batchManager.save(toUpdateRolls),
      );
      return await this.getError(1, changeLog);
    } catch (ex) {
      return await this.getError(7, toFabricInspectionRolls);
    }
  }

  // // allocates a roll to a department.
  // // once an allocation is received, reject all previous allocations.
  async departmentalAllocation(
    toAllocateRolls: AllocatedTo[],
  ): Promise<ApiResponse> {
    const rollIds = toAllocateRolls.map((roll) => roll.RollId);
    const allRolls = await this.defaultEntityManager.find(Rolls, {
      rollId: In(rollIds),
    });

    const pendingAllocations = await this.defaultEntityManager.find(
      LatestRollAllocations,
      {
        RollId: In(rollIds),
      },
    );

    const pendingAllocationIds = await Promise.all(
      pendingAllocations.map((allocation) => allocation.AllocationId),
    );
    const allAllocations = await this.defaultEntityManager.find(Allocations, {
      allocationId: In(pendingAllocationIds),
    });

    const changes = await Promise.all(
      toAllocateRolls.map(async (toFabricInspectionRoll) => {
        const currentRoll = allRolls.find(
          (roll) => roll.rollId == toFabricInspectionRoll.RollId,
        );

  //       // find all previous pending allocations.
        const currentAllocations = allAllocations.filter(
          (allocation) => allocation.rollId == toFabricInspectionRoll.RollId,
        );

        // setting up promise return variable.
        const promiseReturn: Array<Allocations | Allocations[]> = [];

        // reject all previous allocations.
        await Promise.all(
          currentAllocations.map((allocation) => {
            allocation.isLatest = 0;
            allocation.allocationStatus = 'REJECTED';
            allocation.updatedAtDate = new Date();
          }),
        );
        promiseReturn.push(currentAllocations);

        // add a new allocation.
        const allocation = new Allocations();
        allocation.rollId = currentRoll.rollId;
        allocation.allocationStatus = 'PENDING';
        allocation.allocatedTo =
          toFabricInspectionRoll.AllocatedTo.toUpperCase();
        allocation.isLatest = 1;
        promiseReturn.push(allocation);
        return promiseReturn;
      }),
    );

    const toUpdateAllocations: Allocations[][] = changes.map(
      (change) => change[0] as Allocations[],
    );
    const toInsertAllocation: Allocations[] = changes.map(
      (change) => change[1] as Allocations,
    );

    try {
      const changeLog = await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) => {
          const updatedAllocations = await Promise.all(
            toUpdateAllocations.map(
              async (allocation) => await batchManager.save(allocation),
            ),
          );
          const insertedAllocation = await batchManager.save(
            toInsertAllocation,
          );

          const updatedRolls = await Promise.all(
            insertedAllocation.map(async (allocation) => {
              const roll = await batchManager.findOneOrFail(
                Rolls,
                allocation.rollId,
              );
              roll.lastAllocationId = allocation.allocationId;
              roll.updatedAtDate = new Date();
              return await batchManager.save(roll);
            }),
          );
          return [updatedAllocations, updatedRolls];
        },
      );
      return await this.getError(1, changeLog);
    } catch (ex) {
      return await this.getError(8, toAllocateRolls);
    }
  }

  // stocks out roll from warehouse.
  // if roll is rejected in fabric inspection, skip its allocation check.
  // upon stockout, remove rack, location, bin of rolls.
  async stockOut(
    toStockOutRolls: WarehouseTransaction[],
  ): Promise<ApiResponse> {
    const rollIds = toStockOutRolls.map((roll) => roll.rollId);
    const allRolls = await this.defaultEntityManager.find(Rolls, {
      rollId: In(rollIds),
    });

    const pendingAllocations = await this.defaultEntityManager.find(
      LatestRollAllocations,
      {
        RollId: In(rollIds),
      },
    );
    const pendingAllocationIds = await Promise.all(
      pendingAllocations.map((allocation) => allocation.AllocationId),
    );
    const allAllocations = await this.defaultEntityManager.find(Allocations, {
      allocationId: In(pendingAllocationIds),
    });

    const toSet = await Promise.all(
      toStockOutRolls.map(async (toStockOutRoll) => {
        const currentRoll = allRolls.find(
          (roll) => roll.rollId == toStockOutRoll.rollId,
        );

        // setting up promise return variable.
        const promiseReturn: Array<number | Allocations | Rolls> = [];

        // to differentiate between fabric inspection rejected and allocated rolls.
        promiseReturn.push(currentRoll.rollStateId);

        // if roll is fabric inspection rejected. just stock it out.
        // no need to find out its allocations.
        if (currentRoll.rollStateId == 4) currentRoll.rollStateId = 6;
        else {
          // find previous pending allocation.
          const rollAllocation = allAllocations.find(
            (allocation) => allocation.rollId == currentRoll.rollId,
          );

          rollAllocation.allocationStatus = 'EXECUTED';
          rollAllocation.updatedAtDate = new Date();

          promiseReturn.push(rollAllocation);
          const rollStateOther = await this.defaultEntityManager.findOneOrFail(
            RollStates,
            {
              rollState: `${rollAllocation.allocatedTo} WIP`,
              locationCategory: rollAllocation.allocatedTo,
            },
          );
          currentRoll.rollStateId = rollStateOther.rollStateId;
        }
        currentRoll.rackLocatorBin = null; // upon exit, remove rack location bin of roll.
        currentRoll.lastAllocation = null; // important to set last allocation id to null.
        currentRoll.transactionAt = 'WAREHOUSE';
        currentRoll.isFresh = false; // to differentiate between returning and uploaded stock in.
        currentRoll.activityId = null;
        currentRoll.activityRollAssignmentTimestamp = null;
        currentRoll.isTransactionManual = toStockOutRoll.IsManual ? true : false;
        currentRoll.antenna = toStockOutRoll.Antenna;
        currentRoll.updatedAtDate = new Date();
        promiseReturn.push(currentRoll);
        return promiseReturn;
      }),
    );

    // filter out all fabric inspection rejected rolls.
    const rejectedRolls: Array<number | Allocations | Rolls>[] = toSet.filter(
      (change) => change[0] == 4,
    );

    // filter out department allocated rolls.
    const departmentalAllocationRolls: Array<number | Allocations | Rolls>[] =
      toSet.filter((change) => change[0] != 4);

    const toUpdateRejectedRolls: Rolls[] = rejectedRolls.map(
      (change) => change[1] as Rolls,
    );

    const toUpdateDeptAllocatedRollAllocations: Allocations[] =
      departmentalAllocationRolls.map((change) => change[1] as Allocations);

    const toUpdateDeptAllocatedRolls: Rolls[] = departmentalAllocationRolls.map(
      (change) => change[2] as Rolls,
    );

    try {
      const changeLogRejectedRolls =
        await this.defaultEntityManager.transaction(
          async (batchManager: EntityManager) => {
            const updatedRolls = await batchManager.save(toUpdateRejectedRolls);
            return updatedRolls;
          },
        );

      const changeLogAllocatedRolls =
        await this.defaultEntityManager.transaction(
          async (batchManager: EntityManager) => {
            const updatedAllocations = await Promise.all(
              toUpdateDeptAllocatedRollAllocations.map(
                async (allocation) => await batchManager.save(allocation),
              ),
            );
            const updatedRolls = await batchManager.save(
              toUpdateDeptAllocatedRolls,
            );

            return [updatedAllocations, updatedRolls];
          },
        );
      return await this.getError(1, [
        changeLogRejectedRolls,
        changeLogAllocatedRolls,
      ]);
    } catch (ex) {
      return await this.getError(13, toStockOutRolls);
    }
  }

  // splits given roll into two rolls as per given weight.
  // rolls with allocations pending are not allowed to split.
  // handles split at return as well.
  async rollSplit(toSplitRolls: RollSplit[]): Promise<ApiResponse> {
    const rollIds = toSplitRolls.map((roll) => roll.RollId);
    const allRolls = await this.defaultEntityManager.find(Rolls, {
      rollId: In(rollIds),
    });

    const allCompleteRolls = await this.defaultEntityManager.find(
      CompleteRollInfo,
      {
        RollId: In(rollIds),
      },
    );

    const toSet = await Promise.all(
      toSplitRolls.map(async (toSplitRoll) => {
        const currentRoll = allRolls.find(
          (roll) => roll.rollId == toSplitRoll.RollId,
        );
        const currentCompleteRoll = allCompleteRolls.find(
          (roll) => roll.RollId == toSplitRoll.RollId,
        );
          console.log(currentRoll.packingList);
        // deciding roll split location.
        let childRollStateId = -1;
        if (currentCompleteRoll.LocationCategory == 'WAREHOUSE')
          childRollStateId = 5;
        else if (currentCompleteRoll.LocationCategory == 'CUTTING')
          childRollStateId = 8;
        else if (currentCompleteRoll.LocationCategory == 'SAMPLING')
          childRollStateId = 11;
        else if (currentCompleteRoll.LocationCategory == 'SEWING')
          childRollStateId = 13;
        else if (currentCompleteRoll.LocationCategory == 'TRAINING')
          childRollStateId = 15;
        else
          throw new BadRequestException(
            HttpStatus.BAD_REQUEST,
            'Bad Rolls Split.',
          );

        // make child roll.

        const ratio = (currentRoll.netWeight/currentRoll.netLength);
        const childRoll = new Rolls();
        childRoll.netLength = (toSplitRoll.NetLength);
        childRoll.netWeight = toSplitRoll.NetLength * ratio; //toSplitRoll.SplitWeight;

        childRoll.packingList = currentRoll.packingList;
        childRoll.parentRollId = currentRoll.rollId;
        childRoll.isChildRoll = 1;
        childRoll.isFresh = childRollStateId == 5 ? true : false;
        childRoll.rollStateId = childRollStateId;
        childRoll.generatedAt = currentCompleteRoll.LocationCategory;
        childRoll.isCardAssigned = 0;
        childRoll.cardAssignmentTimestamp = null;
        childRoll.transactionAt = currentCompleteRoll.LocationCategory;
        childRoll.lastAllocation = null;
        childRoll.activityId = null;
        childRoll.activityRollAssignmentTimestamp = null;

        // current roll updates.

        // currentRoll.netLength = toSplitRoll.NetLength;
        // currentRoll.netWeight = (currentRoll.netWeight/currentRoll.netLength) * toSplitRoll.SplitWeight;
        // currentRoll.transactionAt = currentCompleteRoll.LocationCategory;
        // currentRoll.updatedAtDate = new Date();
        // return [childRoll, currentRoll];

        //currentRoll.netWeight = (currentRoll.netWeight/currentRoll.netLength) * toSplitRoll.SplitWeight;
        currentRoll.netWeight = (currentRoll.netWeight - childRoll.netWeight);

        currentRoll.netLength = (currentRoll.netLength - childRoll.netLength);
        currentRoll.transactionAt = currentCompleteRoll.LocationCategory;
        currentRoll.updatedAtDate = new Date();
        return [childRoll, currentRoll];
      }),
    );

    const toInsertChildRolls: Rolls[] = toSet.map((change) => change[0] as Rolls);
    const toUpdateRolls: Rolls[] = toSet.map((change) => change[1] as Rolls);

    try {
      const changeLog = await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) => {
          const insertedChildRolls = await batchManager.save(
            toInsertChildRolls,
          );
          const updatedRolls = await batchManager.save(toUpdateRolls);
          return [insertedChildRolls, updatedRolls];
        },
      );
      return await this.getError(1, changeLog);
    } catch (ex) {
      return await this.getError(10, ex);
    }
  }

  // clears all previous allocations.
  async clearAllocation(
    toClearAllocationRolls: ClearAllocation[],
  ): Promise<ApiResponse> {
    const rollIds = toClearAllocationRolls.map((roll) => roll.RollId);
    const allRolls = await this.defaultEntityManager.find(Rolls, {
      rollId: In(rollIds),
    });

    const allAllocations = await this.defaultEntityManager.find(Allocations, {
      rollId: In(rollIds),
      allocationStatus: 'PENDING',
    });

    const toSet = await Promise.all(
      toClearAllocationRolls.map(async (toClearAllocationRoll) => {
        const currentRoll = allRolls.find(
          (roll) => roll.rollId == toClearAllocationRoll.RollId,
        );

        // find all previous pending allocations.
        const currentAllocations = allAllocations.filter(
          (allocation) => allocation.rollId == toClearAllocationRoll.RollId,
        );

        // setting up promise return variable.
        const promiseReturn: Array<Allocations[] | Rolls> = [];

        // reject all previous allocations.
        await Promise.all(
          currentAllocations.map((allocation) => {
            // reject all allocations except for one which is assigned to roll.
            allocation.allocationStatus = 'REJECTED';
            allocation.updatedAtDate = new Date();
          }),
        );
        promiseReturn.push(currentAllocations);

        // important to set last allocation id to null.
        currentRoll.lastAllocation = null;
        currentRoll.updatedAtDate = new Date();
        promiseReturn.push(currentRoll);
        return promiseReturn;
      }),
    );

    const toUpdateAllocations: Allocations[][] = toSet.map(
      (change) => change[0] as Allocations[],
    );
    const toUpdateRolls: Rolls[] = toSet.map((change) => change[1] as Rolls);

    try {
      const changeLog = await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) => {
          const updatedAllocations = await Promise.all(
            toUpdateAllocations.map(
              async (allocation) => await batchManager.save(allocation),
            ),
          );
          const updatedRolls = await batchManager.save(toUpdateRolls);
          return [updatedAllocations, updatedRolls];
        },
      );
      return await this.getError(1, changeLog);
    } catch (ex) {
      return await this.getError(19, toClearAllocationRolls);
    }
  }

  // update roll location.
  async updateLocation(
    toUpdateLocationRolls: UpdateLocation[],
  ): Promise<ApiResponse> {
    const rollIds = toUpdateLocationRolls.map((roll) => roll.RollId);
    const allRolls = await this.defaultEntityManager.find(Rolls, {
      rollId: In(rollIds),
    });

    const toSet = await Promise.all(
      toUpdateLocationRolls.map(async (toUpdateLocationRoll) => {
        const currentRoll = allRolls.find(
          (roll) => roll.rollId == toUpdateLocationRoll.RollId,
        );

        // setting up promise return variable.
        const promiseReturn: Array<Rolls> = [];

        // important to set last allocation id to null.
        currentRoll.rackLocatorBin = `R${
          toUpdateLocationRoll.Location.Rack ?? ''
        }-L${toUpdateLocationRoll.Location.Locator ?? ''}-B${
          toUpdateLocationRoll.Location.Bin ?? ''
        }`;
        currentRoll.updatedAtDate = new Date();
        promiseReturn.push(currentRoll);
        return promiseReturn;
      }),
    );

    const toUpdateRolls: Rolls[] = toSet.map((change) => change[0] as Rolls);
    try {
      const changeLog = await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) =>
          await batchManager.save(toUpdateRolls),
      );
      return await this.getError(1, changeLog);
    } catch (ex) {
      return await this.getError(14, toUpdateLocationRolls);
    }
  }

  // // update order for a given roll.
  async updateOrder(toUpdateOrderRolls: UpdateOrder[]): Promise<ApiResponse> {
    const rollIds = toUpdateOrderRolls.map((roll) => roll.RollId);
    const allRolls = await this.defaultEntityManager.find(Rolls, {
      rollId: In(rollIds),
    });

    const allPackingListIds = allRolls.map((roll) => roll.packingList);
    const allPackingListRolls = await this.defaultEntityManager.find(
      PackingList,
      {
        packingListId: In(allPackingListIds),
      },
    );

    const toUpdateRolls = await Promise.all(
      toUpdateOrderRolls.map(async (toUpdateOrderRoll) => {
        const currentRoll = allRolls.find(
          (roll) => roll.rollId == toUpdateOrderRoll.RollId,
        );

        const currentPackingListRoll = allPackingListRolls.find(
          (roll) => roll.packingListId == currentRoll.packingList,
        );

        currentPackingListRoll.order = toUpdateOrderRoll.Order.toUpperCase();
        return currentPackingListRoll;
      }),
    );

    try {
      const changeLog = await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) =>
          await batchManager.save(toUpdateRolls),
      );
      return await this.getError(1, changeLog);
    } catch (ex) {
      return await this.getError(15, toUpdateOrderRolls);
    }
  }

  // // removes packing list.
  async deletePackingList(packingListCode: number): Promise<ApiResponse> {
    try {
      const removal: {
        errorNumber: number;
        errorMessage: string;
      } = await this.defaultEntityManager.query(
        `execute Api.sp_DeletePackingList ${packingListCode};`,
      );

      if (removal[0].errorNumber != 0)
        throw new InternalServerErrorException(
          removal,
          removal[0].errorMessage,
        );
      return await this.getError(1);
    } catch (ex) {
      return await this.getError(20);
    }
  }
}
