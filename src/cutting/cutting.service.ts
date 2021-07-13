import { Activities } from './../entity/models/Activities';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import ApiResponse from '../entity/dtos/ApiResponse';
import Wastage from '../entity/dtos/Wastage';
import { ErrorsList } from '../entity/models/ErrorsList';
import { Rolls } from '../entity/models/Rolls';

@Injectable()
export class CuttingService {
  // local copy all errors stored in memory to avoid fetching errors from database repeatedly.
  private errorsList: ErrorsList[];

  constructor(
    @InjectEntityManager()
    public readonly defaultEntityManager: EntityManager,
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

  // generate new activity.
  async generateActivity(): Promise<ApiResponse> {
    try {
      const allocation = await this.defaultEntityManager.insert(Activities, [
        {
          startTime: new Date(),
          endTime: new Date(),
          smallWaste: 0,
          largeWaste: 0,
          activityStatus: 'PENDING',
        },
      ]);
      return await this.getError(1, {
        ActivityId: allocation.identifiers[0].activityId,
      });
    } catch (ex) {
      return await this.getError(16, ex);
    }
  }

  // submits wastage.
  // once wastage is submitted, turn all rolls in this activity to processed.
  async submitWastage(
    wastage: Wastage,
    toSubmitActivity: Activities,
    activityRolls: Rolls[],
  ): Promise<ApiResponse> {
    try {
      // for each roll, update its roll state id to cutting progress.
      const toUpdateRolls = await Promise.all(
        activityRolls.map((roll) => {
          roll.activityId = wastage.ActivityId;
          roll.activityRollAssignmentTimestamp = new Date();
          roll.transactionAt = 'CUTTING';
          roll.updatedAtDate = new Date();
          roll.rollStateId = 9;
          return roll;
        }),
      );

      // update activity information.
      toSubmitActivity.startTime = wastage.StartTime;
      toSubmitActivity.endTime = wastage.EndTime;
      toSubmitActivity.smallWaste = wastage.SmallWaste;
      toSubmitActivity.largeWaste = wastage.LargeWaste;
      toSubmitActivity.shift = wastage.Shift;
      toSubmitActivity.activityStatus = 'SUBMITTED';
      toSubmitActivity.updatedAtDate = new Date();

      await this.defaultEntityManager.transaction(
        async (batchManager: EntityManager) => {
          await batchManager.save(toSubmitActivity);
          await batchManager.save(toUpdateRolls);
        },
      );
      return await this.getError(1);
    } catch (ex) {
      return await this.getError(17, ex);
    }
  }
}
