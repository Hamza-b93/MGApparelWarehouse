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
exports.CuttingController = void 0;
const Activities_1 = require("./../entity/models/Activities");
const PendingActivities_1 = require("./../entity/views/PendingActivities");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ApiResponse_1 = __importDefault(require("../entity/dtos/ApiResponse"));
const Wastage_1 = __importDefault(require("../entity/dtos/Wastage"));
const ErrorsList_1 = require("../entity/models/ErrorsList");
const Rolls_1 = require("../entity/models/Rolls");
const RollsForActivity_1 = require("../entity/views/RollsForActivity");
const cutting_service_1 = require("./cutting.service");
let CuttingController = class CuttingController {
    constructor(cuttingService, defaultEntityManager) {
        this.cuttingService = cuttingService;
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
    async generateActivity() {
        try {
            return await this.cuttingService.generateActivity();
        }
        catch (ex) {
            throw new common_1.InternalServerErrorException(await this.getError(16, ex));
        }
    }
    // order, fabric_lot, fabric_color combination cannot repeat in a given activity.
    async submitWastage(wastage) {
        try {
            if (wastage.StartTime >= wastage.EndTime) {
                throw new common_1.HttpException('Bad StartTime & EndTime.', common_1.HttpStatus.FORBIDDEN);
            }
            // only pending activities are allowed to be submitted.
            const pendingActivity = await this.defaultEntityManager.findOneOrFail(PendingActivities_1.PendingActivity, {
                ActivityId: wastage.ActivityId,
            });
            // get current activity data.
            const toSubmitActivity = await this.defaultEntityManager.findOneOrFail(Activities_1.Activities, pendingActivity.ActivityId);
            // to map rolls.
            const toMapRolls = await this.defaultEntityManager.find(RollsForActivity_1.RollsForActivity, {
                RollId: typeorm_2.In(wastage.RollIds),
            });
            if (toMapRolls.length == 0 ||
                toMapRolls.length < wastage.RollIds.length) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. One or more rolls are not available for activity assignment.', wastage));
            }
            // Order, FabricLot, FabricColor combination can never repeat.
            let hasMoreThanOneCombination = false;
            let currOrder = null, currFabricLot = null, currFabricColor = null;
            await Promise.all(toMapRolls.map((roll) => {
                if (currOrder == null &&
                    currFabricLot == null &&
                    currFabricColor == null) {
                    currOrder = roll.Order;
                    currFabricLot = roll.FabricLot;
                    currFabricColor = roll.FabricColor;
                }
                else if (currOrder != roll.Order ||
                    currFabricLot != roll.FabricLot ||
                    currFabricColor != roll.FabricColor) {
                    hasMoreThanOneCombination = true;
                }
            }));
            // more than one combination found. throw error.
            if (hasMoreThanOneCombination) {
                throw new common_1.BadRequestException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. All rolls must belong to same Order, FabricLot, FabricColor combination.', wastage));
            }
            // get all activity assigned rolls, if no one found. throw an error.
            const activityRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
                rollId: typeorm_2.In(wastage.RollIds),
            });
            return await this.cuttingService.submitWastage(wastage, toSubmitActivity, activityRolls);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            else if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(17, ex));
        }
    }
};
__decorate([
    common_1.Post('generate_activity'),
    common_1.Header('Content-type', 'application/json'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CuttingController.prototype, "generateActivity", null);
__decorate([
    common_1.Post('submit_wastage'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Wastage_1.default]),
    __metadata("design:returntype", Promise)
], CuttingController.prototype, "submitWastage", null);
CuttingController = __decorate([
    common_1.Controller('api/v1/cutting'),
    __param(1, typeorm_1.InjectEntityManager()),
    __metadata("design:paramtypes", [cutting_service_1.CuttingService,
        typeorm_2.EntityManager])
], CuttingController);
exports.CuttingController = CuttingController;
//# sourceMappingURL=cutting.controller.js.map