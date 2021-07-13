import { Activities } from './../entity/models/Activities';
import { PendingActivity } from './../entity/views/PendingActivities';
import {
  BadRequestException,
  Body,
  Controller,
  Header,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import ApiResponse from '../entity/dtos/ApiResponse';
import Wastage from '../entity/dtos/Wastage';
import { ErrorsList } from '../entity/models/ErrorsList';
import { Rolls } from '../entity/models/Rolls';
import { RollsForActivity } from '../entity/views/RollsForActivity';
import { CuttingService } from './cutting.service';

@Controller('api/v1/cutting')
export class CuttingController {
  // local copy all errors stored in memory to avoid fetching errors from database repeatedly.
  private errorsList: ErrorsList[];

  constructor(
    private readonly cuttingService: CuttingService,

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

  @Post('generate_activity')
  @Header('Content-type', 'application/json')
  async generateActivity(): Promise<ApiResponse> {
    try {
      return await this.cuttingService.generateActivity();
    } catch (ex) {
      throw new InternalServerErrorException(await this.getError(16, ex));
    }
  }

  // order, fabric_lot, fabric_color combination cannot repeat in a given activity.
  @Post('submit_wastage')
  @Header('Content-type', 'application/json')
  @UsePipes(ValidationPipe)
  async submitWastage(@Body() wastage: Wastage): Promise<ApiResponse> {
    try {
      if (wastage.StartTime >= wastage.EndTime) {
        throw new HttpException(
          'Bad StartTime & EndTime.',
          HttpStatus.FORBIDDEN,
        );
      }

      // only pending activities are allowed to be submitted.
      const pendingActivity = await this.defaultEntityManager.findOneOrFail(
        PendingActivity,
        {
          ActivityId: wastage.ActivityId,
        },
      );

      // get current activity data.
      const toSubmitActivity = await this.defaultEntityManager.findOneOrFail(
        Activities,
        pendingActivity.ActivityId,
      );

      // to map rolls.
      const toMapRolls = await this.defaultEntityManager.find(
        RollsForActivity,
        {
          RollId: In(wastage.RollIds),
        },
      );

      if (
        toMapRolls.length == 0 ||
        toMapRolls.length < wastage.RollIds.length
      ) {
        throw new NotFoundException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. One or more rolls are not available for activity assignment.',
            wastage,
          ),
        );
      }

      // Order, FabricLot, FabricColor combination can never repeat.
      let hasMoreThanOneCombination = false;
      let currOrder: string = null,
        currFabricLot: string = null,
        currFabricColor: string = null;
      await Promise.all(
        toMapRolls.map((roll) => {
          if (
            currOrder == null &&
            currFabricLot == null &&
            currFabricColor == null
          ) {
            currOrder = roll.Order;
            currFabricLot = roll.FabricLot;
            currFabricColor = roll.FabricColor;
          } else if (
            currOrder != roll.Order ||
            currFabricLot != roll.FabricLot ||
            currFabricColor != roll.FabricColor
          ) {
            hasMoreThanOneCombination = true;
          }
        }),
      );

      // more than one combination found. throw error.
      if (hasMoreThanOneCombination) {
        throw new BadRequestException(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            'Invalid Rolls. All rolls must belong to same Order, FabricLot, FabricColor combination.',
            wastage,
          ),
        );
      }

      // get all activity assigned rolls, if no one found. throw an error.
      const activityRolls = await this.defaultEntityManager.find(Rolls, {
        rollId: In(wastage.RollIds),
      });

      return await this.cuttingService.submitWastage(
        wastage,
        toSubmitActivity,
        activityRolls,
      );
    } catch (ex) {
      if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex);
      } else if (ex instanceof BadRequestException) {
        throw new BadRequestException(ex);
      }
      throw new InternalServerErrorException(await this.getError(17, ex));
    }
  }
}
