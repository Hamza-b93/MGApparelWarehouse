"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuttingService = void 0;
const Activities_1 = require("./../entity/models/Activities");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ApiResponse_1 = __importDefault(require("../entity/dtos/ApiResponse"));
const ErrorsList_1 = require("../entity/models/ErrorsList");
let CuttingService = class CuttingService {
    constructor(defaultEntityManager) {
        this.defaultEntityManager = defaultEntityManager;
    }
    // only load errors from database which do not exist.
    async getError(errorId, data = null) {
        // On boot, refresh all records;
        if (!this.errorsList)
            this.errorsList = await this.defaultEntityManager.find(ErrorsList_1.ErrorsList);
        // if error is not found. refresh from database table otherwise throw an error.
        try {
            // error not found, refresh whole list.
            // also find again in refreshed list.
            let currError = this.errorsList.find((error) => error.errorId == errorId);
            if (!currError) {
                this.errorsList = await this.defaultEntityManager.find(ErrorsList_1.ErrorsList);
                currError = this.errorsList.find((error) => error.errorId == errorId);
            }
            return new ApiResponse_1.default(currError.errorNumber, currError.errorMessage, data);
        }
        catch (ex) {
            return new ApiResponse_1.default(-1, 'BAD EXECUTION ERROR. API FAILED.');
        }
    }
    // generate new activity.
    async generateActivity() {
        try {
            const allocation = await this.defaultEntityManager.insert(Activities_1.Activities, [
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
        }
        catch (ex) {
            return await this.getError(16, ex);
        }
    }
    // submits wastage.
    // once wastage is submitted, turn all rolls in this activity to processed.
    async submitWastage(wastage, toSubmitActivity, activityRolls) {
        try {
            // for each roll, update its roll state id to cutting progress.
            const toUpdateRolls = await Promise.all(activityRolls.map((roll) => {
                roll.activityId = wastage.ActivityId;
                roll.activityRollAssignmentTimestamp = new Date();
                roll.transactionAt = 'CUTTING';
                roll.updatedAtDate = new Date();
                roll.rollStateId = 9;
                return roll;
            }));
            // update activity information.
            toSubmitActivity.startTime = wastage.StartTime;
            toSubmitActivity.endTime = wastage.EndTime;
            toSubmitActivity.smallWaste = wastage.SmallWaste;
            toSubmitActivity.largeWaste = wastage.LargeWaste;
            toSubmitActivity.shift = wastage.Shift;
            toSubmitActivity.activityStatus = 'SUBMITTED';
            toSubmitActivity.updatedAtDate = new Date();
            await this.defaultEntityManager.transaction(async (batchManager) => {
                await batchManager.save(toSubmitActivity);
                await batchManager.save(toUpdateRolls);
            });
            return await this.getError(1);
        }
        catch (ex) {
            return await this.getError(17, ex);
        }
    }
};
CuttingService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectEntityManager()),
    __metadata("design:paramtypes", [typeorm_2.EntityManager])
], CuttingService);
exports.CuttingService = CuttingService;
//# sourceMappingURL=cutting.service.js.map