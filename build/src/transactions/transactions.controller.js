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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const PackingList_1 = require("../entity/models/PackingList");
const VerifyLogin_1 = __importDefault(require("../entity/dtos/VerifyLogin"));
const ApiResponse_1 = __importDefault(require("../entity/dtos/ApiResponse"));
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const ErrorsList_1 = require("../entity/models/ErrorsList");
const CardAssignableRolls_1 = require("../entity/views/CardAssignableRolls");
const ReadyToWarehouseStockInRolls_1 = require("../entity/views/ReadyToWarehouseStockInRolls");
const FabricInspectionReadyRolls_1 = require("../entity/views/FabricInspectionReadyRolls");
const ReadyToWarehouseStockOutRolls_1 = require("../entity/views/ReadyToWarehouseStockOutRolls");
const SuitableRollsToSplit_1 = require("../entity/views/SuitableRollsToSplit");
const RollSplit_1 = __importDefault(require("../entity/dtos/RollSplit"));
const AllocatedTo_1 = __importDefault(require("../entity/dtos/AllocatedTo"));
const CompleteRollInfo_1 = require("../entity/views/CompleteRollInfo");
const AssignTag_1 = __importDefault(require("../entity/dtos/AssignTag"));
const WarehouseTransaction_1 = __importDefault(require("../entity/dtos/WarehouseTransaction"));
const StockedInRolls_1 = require("../entity/views/StockedInRolls");
const Allocations_1 = require("../entity/models/Allocations");
const ReturnAllocatedRolls_1 = require("../entity/views/ReturnAllocatedRolls");
const Tag_1 = require("../entity/models/Tag");
const ClearAllocation_1 = __importDefault(require("../entity/dtos/ClearAllocation"));
const UpdateLocation_1 = __importDefault(require("../entity/dtos/UpdateLocation"));
const UpdateOrder_1 = __importDefault(require("../entity/dtos/UpdateOrder"));
const FabricInspection_1 = __importDefault(require("../entity/dtos/FabricInspection"));
const ReturnStock_1 = __importDefault(require("../entity/dtos/ReturnStock"));
let TransactionsController = class TransactionsController {
    constructor(transactionsService, defaultEntityManager) {
        this.transactionsService = transactionsService;
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
    async verifyLogin(userLogin) {
        const verification = await this.transactionsService.VerifyLogin(userLogin);
        if (verification instanceof ApiResponse_1.default)
            throw new common_1.UnauthorizedException(verification);
        return verification;
    }
    async uploadPackingList(toUploadPackingList) {
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
            const uploadStatus = await this.transactionsService.uploadPackingList(toUploadPackingList);
            if (uploadStatus.ErrorNumber != 0) {
                //console.log(uploadStatus)
                throw new common_1.BadRequestException(toUploadPackingList, 'Bad packing list. Kindly check content of packing list.');
            }
            return this.getError(1);
        }
        catch (ex) {
            if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(3, ex));
        }
    }
    async uploadTag(toUploadTagList) {
        try {
            const uploadStatus = await this.transactionsService.uploadTagList(toUploadTagList);
            if (uploadStatus.ErrorNumber != 0) {
                //console.log(uploadStatus)
                throw new common_1.BadRequestException(toUploadTagList, 'Bad packing list. Kindly check content of packing list.');
            }
            return this.getError(1);
        }
        catch (ex) {
            if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(3, ex));
        }
    }
    async assignTag(toAssignTags) {
        try {
            const rollIds = await Promise.all(toAssignTags.map((assignTag) => {
                console.log(assignTag);
                return assignTag.RollId;
            }));
            const cardAssignableRolls = await this.defaultEntityManager.findByIds(CardAssignableRolls_1.CardAssignableRolls, rollIds);
            if (cardAssignableRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid rolls. Not suitable to assign cards.', {
                    Ids: rollIds,
                }));
            }
            else if (cardAssignableRolls.length != rollIds.length) {
                const presentIds = await Promise.all(cardAssignableRolls.map((roll) => {
                    return roll.RollId;
                }));
                // for each roll in present ids.
                // get tag ids for those rolls as well.
                const presentTags = await Promise.all(cardAssignableRolls.map((roll) => {
                    const rollTag = toAssignTags.find((roll2) => roll2.RollId == roll.RollId);
                    return rollTag;
                }));
                const assigned = await this.transactionsService.assignCard(presentTags);
                const absentIds = rollIds.filter((id) => !presentIds.includes(id));
                throw new common_1.BadRequestException(new ApiResponse_1.default(common_1.HttpStatus.PARTIAL_CONTENT, 'Missing rolls. Partial assignment executed against found ids.', {
                    FoundIds: assigned,
                    NotFoundIds: absentIds,
                }));
            }
            // for each roll in present ids.
            // get tag ids for those rolls as well.
            const presentTags = await Promise.all(cardAssignableRolls.map((roll) => {
                const rollTag = toAssignTags.find((roll2) => roll2.RollId == roll.RollId);
                return rollTag;
            }));
            return await this.transactionsService.assignCard(presentTags);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            else if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(9, ex));
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
    async stockIn(stockIn) {
        try {
            const rollIds = await Promise.all(stockIn.map((roll) => roll.rollId));
            const toStockInRolls = await this.defaultEntityManager.find(ReadyToWarehouseStockInRolls_1.ReadyToWarehouseStockInRolls, {
                where: [
                    {
                        RollId: typeorm_1.In(rollIds),
                        LastAllocationId: typeorm_1.IsNull(),
                    },
                    {
                        RollId: typeorm_1.In(rollIds),
                        RollStateId: 2,
                    },
                ],
            });
            console.log(toStockInRolls);
            if (toStockInRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for stocking in.', stockIn));
            }
            const cardAssignedRolls = toStockInRolls.filter((roll) => roll.RollStateId == 2);
            const returningRolls = toStockInRolls.filter((roll) => roll.RollStateId != 2);
            let stockedInCardAssignedRolls = null;
            let returnedRolls = null;
            if (cardAssignedRolls.length > 0) {
                const rollIds = cardAssignedRolls.map((roll) => roll.RollId);
                const toStockInCardAssignedRolls = stockIn.filter((roll) => rollIds.includes(roll.rollId));
                stockedInCardAssignedRolls =
                    await this.transactionsService.stockInCardAssigned(toStockInCardAssignedRolls);
            }
            if (returningRolls.length > 0) {
                const rollIds = returningRolls.map((roll) => roll.RollId);
                const toReturningRolls = stockIn.filter((roll) => rollIds.includes(roll.rollId));
                console.log(toReturningRolls);
                returnedRolls = await this.transactionsService.stockInAllocation(toReturningRolls);
            }
            //     // if any of one type or rolls are received, handle response accordingly.
            if ((stockedInCardAssignedRolls ?? false) && (returnedRolls ?? false))
                return [stockedInCardAssignedRolls, returnedRolls];
            else if (stockedInCardAssignedRolls ?? false)
                return stockedInCardAssignedRolls;
            return returnedRolls;
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(5, ex));
        }
    }
    async returnStock(returnStock) {
        try {
            const rollIds = await Promise.all(returnStock.map((roll) => roll.RollId));
            const toStockInRolls = await this.defaultEntityManager.find(ReadyToWarehouseStockInRolls_1.ReadyToWarehouseStockInRolls, {
                RollId: typeorm_1.In(rollIds),
                LastAllocationId: typeorm_1.Not(typeorm_1.IsNull()),
                RollStateId: typeorm_1.In([8, 10, 12, 14]),
            });
            console.log(rollIds);
            console.log(toStockInRolls);
            if (toStockInRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for returning to stock.', returnStock));
            }
            //     // filter out rolls which have been found out from above request.
            const rollIds2 = toStockInRolls.map((roll) => roll.RollId);
            const toReturningRolls = returnStock.filter((roll) => rollIds2.includes(roll.RollId));
            return await this.transactionsService.returnStock(toReturningRolls);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(6, ex));
        }
    }
    async fabricInspection(fabricInspection) {
        try {
            const rollIds = await Promise.all(fabricInspection.map((roll) => roll.RollId));
            const toFabricInspectionRolls = await this.defaultEntityManager.find(FabricInspectionReadyRolls_1.FabricInspectionReadyRolls, {
                RollId: typeorm_1.In(rollIds),
            });
            if (toFabricInspectionRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for fabric inspection.', fabricInspection));
            }
            //     // filter out rolls which have been found out from above request.
            const presentIds = toFabricInspectionRolls.map((roll) => roll.RollId);
            const toFabricInspectionRolls2 = fabricInspection.filter((roll) => presentIds.includes(roll.RollId));
            return await this.transactionsService.fabricInspection(toFabricInspectionRolls2);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(12, ex));
        }
    }
    // // a single roll can have allocations allowed multiple times.
    // // allocation only allowed for rolls which are either card assigned + stocked in or wip of any department.
    // // if same allocation is requested as already present, discard it too.
    async departmentalAllocation(rollAllocation) {
        try {
            const rollIds = await Promise.all(rollAllocation.map((roll) => roll.RollId));
            //     // if rolls are stocked in then allocation can be done to any other department other than warehouse.
            //     // else if rolls are outside WIP then allocation can only be done towards warehouse.
            const allCompleteRolls = await this.defaultEntityManager.find(CompleteRollInfo_1.CompleteRollInfo, {
                RollId: typeorm_1.In(rollIds),
                IsCardAssigned: 1,
                RollStateId: typeorm_1.In([5, 8, 10, 12, 14]),
            });
            // last pending allocations, if found.
            const lastAllocations = await this.defaultEntityManager.find(Allocations_1.Allocations, {
                rollId: typeorm_1.In(rollIds),
                allocationStatus: 'PENDING',
            });
            //     // remove rolls which are allocated to same department as current.
            //     // also remove rolls which have same allocation as already present as requested one.
            //     // and remove rolls which are in other departments WIP and allocation is not towards warehouse.
            //     // also skip for such rolls which have no prior allocation.
            const toAllocateRolls = allCompleteRolls.filter((roll) => {
                const roll2 = rollAllocation.find((roll3) => roll3.RollId == roll.RollId);
                // if roll has no prior allocation, skip its check.
                const lastAllocation = lastAllocations.find((allocation) => allocation.rollId == roll.RollId);
                return (!lastAllocation ||
                    (roll.LocationCategory != roll2.AllocatedTo &&
                        lastAllocation.allocatedTo != roll2.AllocatedTo &&
                        ((roll.RollStateId != 5 && roll2.AllocatedTo == 'WAREHOUSE') ||
                            (roll.RollStateId == 5 && roll2.AllocatedTo != 'WAREHOUSE'))));
            });
            if (toAllocateRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for allocation.', rollAllocation));
            }
            else if (toAllocateRolls.length < rollAllocation.length) {
                //       // filter out rolls which have been found out from above request.
                const presentIds = toAllocateRolls.map((roll) => roll.RollId);
                const toAllocateRolls2 = rollAllocation.filter((roll) => presentIds.includes(roll.RollId));
                const allocatedRolls = await this.transactionsService.departmentalAllocation(toAllocateRolls2);
                const absentIds = rollIds.filter((id) => !presentIds.includes(id));
                throw new common_1.BadRequestException(new ApiResponse_1.default(common_1.HttpStatus.BAD_REQUEST, 'Missing Rolls. Some rolls are not available for allocation.', {
                    FoundIds: allocatedRolls,
                    NotFoundIds: absentIds,
                }));
            }
            //     // filter out rolls which have been found out from above request.
            const presentIds = toAllocateRolls.map((roll) => roll.RollId);
            const toAllocateRolls2 = rollAllocation.filter((roll) => presentIds.includes(roll.RollId));
            return await this.transactionsService.departmentalAllocation(toAllocateRolls2);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            else if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(8, ex));
        }
    }
    async stockOut(stockOut) {
        try {
            const rollIds = await Promise.all(stockOut.map((roll) => roll.rollId));
            const allRolls = await this.defaultEntityManager.find(ReadyToWarehouseStockOutRolls_1.ReadyToWarehouseStockOutRolls, {
                RollId: typeorm_1.In(rollIds),
            });
            //     // remove rolls which are not found.
            const toStockOutRolls = await Promise.all(allRolls.filter((roll) => {
                return stockOut.find((roll2) => roll2.rollId == roll.RollId);
            }));
            console.log("To Stockout rolls: " + toStockOutRolls);
            if (toStockOutRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for stocking out.', stockOut));
            }
            else if (toStockOutRolls.length < stockOut.length) {
                // filter out rolls which have been found out from above request.
                const presentIds = toStockOutRolls.map((roll) => roll.RollId);
                const toStockOutRolls2 = stockOut.filter((roll) => presentIds.includes(roll.rollId));
                const stockedOutRolls = await this.transactionsService.stockOut(toStockOutRolls2);
                const absentIds = rollIds.filter((id) => !presentIds.includes(id));
                throw new common_1.BadRequestException(new ApiResponse_1.default(common_1.HttpStatus.BAD_REQUEST, 'Missing Rolls. Some rolls are not available for stocking out.', {
                    FoundIds: stockedOutRolls,
                    NotFoundIds: absentIds,
                }));
            }
            //     // filter out rolls which have been found out from above request.
            const presentIds = toStockOutRolls.map((roll) => roll.RollId);
            const toStockOutRolls2 = stockOut.filter((roll) => presentIds.includes(roll.rollId));
            return await this.transactionsService.stockOut(toStockOutRolls2);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            else if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(13, ex));
        }
    }
    async rollSplit(rollSplit) {
        try {
            //     // make sure only cutting, warehouse rolls is passed down to rollSplit method.
            const rollIds = await Promise.all(rollSplit.map((roll) => roll.RollId));
            console.log(rollIds);
            const allRolls = await this.defaultEntityManager.find(SuitableRollsToSplit_1.SuitableRollsToSplit, {
                RollId: typeorm_1.In(rollIds),
            });
            //     // remove rolls which are not found.
            const toSplitRolls = await Promise.all(allRolls.filter((roll) => {
                const splitRoll = rollSplit.find((roll2) => roll2.RollId == roll.RollId);
                return splitRoll.NetLength < roll.NetLength;
            }));
            if (toSplitRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for splitting.', rollSplit));
            }
            else if (toSplitRolls.length < rollSplit.length) {
                //       // filter out rolls which have been found out from above request.
                //       // also filter out rolls which have split weight >= netweight.
                const presentIds = toSplitRolls.map((roll) => roll.RollId);
                const toSplitRolls2 = rollSplit.filter((roll) => presentIds.includes(roll.RollId) &&
                    roll.NetLength <
                        toSplitRolls.find((roll2) => roll2.RollId == roll.RollId)
                            .NetLength);
                const splittedRolls = await this.transactionsService.rollSplit(toSplitRolls2);
                const absentIds = rollIds.filter((id) => !presentIds.includes(id));
                throw new common_1.BadRequestException(new ApiResponse_1.default(common_1.HttpStatus.BAD_REQUEST, 'Missing Rolls. Some rolls are not available for splitting.', {
                    FoundIds: splittedRolls,
                    NotFoundIds: absentIds,
                }));
            }
            //     // filter out rolls which have been found out from above request.
            const presentIds = toSplitRolls.map((roll) => roll.RollId);
            const toSplitRolls2 = rollSplit.filter((roll) => presentIds.includes(roll.RollId) &&
                roll.NetLength <
                    toSplitRolls.find((roll2) => roll2.RollId == roll.RollId).NetLength);
            return await this.transactionsService.rollSplit(toSplitRolls2);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            else if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(10, ex));
        }
    }
    async rollSplitAtReturn(rollSplit) {
        try {
            const rollIds = await Promise.all(rollSplit.map((roll) => roll.RollId));
            const allRolls = await this.defaultEntityManager.find(ReturnAllocatedRolls_1.ReturnAllocatedRolls, {
                RollId: typeorm_1.In(rollIds),
                RollStateId: typeorm_1.In([10, 12, 14]), // only allow sampling, training, sewing wip rolls.
            });
            //     // remove rolls which are not found.
            const toSplitRolls = await Promise.all(allRolls.filter((roll) => rollSplit.find((roll2) => roll2.RollId == roll.RollId)));
            if (toSplitRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for splitting.', rollSplit));
            }
            else if (toSplitRolls.length < rollSplit.length) {
                // filter out rolls which have been found out from above request.
                // also filter out rolls which have split weight >= netweight.
                const presentIds = toSplitRolls.map((roll) => roll.RollId);
                const toSplitRolls2 = rollSplit.filter((roll) => presentIds.includes(roll.RollId) &&
                    roll.NetLength <
                        toSplitRolls.find((roll2) => roll2.RollId == roll.RollId)
                            .NetLength);
                const splittedRolls = await this.transactionsService.rollSplit(toSplitRolls2);
                const absentIds = rollIds.filter((id) => !presentIds.includes(id));
                throw new common_1.BadRequestException(new ApiResponse_1.default(common_1.HttpStatus.BAD_REQUEST, 'Missing Rolls. Some rolls are not available for splitting.', {
                    FoundIds: splittedRolls,
                    NotFoundIds: absentIds,
                }));
            }
            //     // filter out rolls which have been found out from above request.
            const presentIds = toSplitRolls.map((roll) => roll.RollId);
            const toSplitRolls2 = rollSplit.filter((roll) => presentIds.includes(roll.RollId) &&
                roll.NetLength <
                    toSplitRolls.find((roll2) => roll2.RollId == roll.RollId).NetLength);
            return await this.transactionsService.rollSplit(toSplitRolls2);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            else if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(10, ex));
        }
    }
    async clearAllocation(clearLocationRolls) {
        try {
            const rollIds = await Promise.all(clearLocationRolls.map((roll) => roll.RollId));
            const allRolls = await this.defaultEntityManager.find(StockedInRolls_1.StockedInRolls, {
                RollId: typeorm_1.In(rollIds),
            });
            // remove rolls which are not found.
            const toClearLocationRolls = await Promise.all(allRolls.filter((roll) => clearLocationRolls.find((roll2) => roll2.RollId == roll.RollId)));
            if (toClearLocationRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for clearing location.', clearLocationRolls));
            }
            else if (toClearLocationRolls.length < clearLocationRolls.length) {
                //       // filter out rolls which have been found out from above request.
                const presentIds = toClearLocationRolls.map((roll) => roll.RollId);
                const toClearLocationRolls2 = clearLocationRolls.filter((roll) => presentIds.includes(roll.RollId));
                const clearedRolls = await this.transactionsService.clearAllocation(toClearLocationRolls2);
                const absentIds = rollIds.filter((id) => !presentIds.includes(id));
                throw new common_1.BadRequestException(new ApiResponse_1.default(common_1.HttpStatus.BAD_REQUEST, 'Missing Rolls. Some rolls are not available for clearing locations.', {
                    FoundIds: clearedRolls,
                    NotFoundIds: absentIds,
                }));
            }
            //     // filter out rolls which have been found out from above request.
            const presentIds = toClearLocationRolls.map((roll) => roll.RollId);
            const toClearLocationRolls2 = clearLocationRolls.filter((roll) => presentIds.includes(roll.RollId));
            return await this.transactionsService.clearAllocation(toClearLocationRolls2);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            else if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(19, ex));
        }
    }
    async updateLocation(updateLocationRolls) {
        try {
            const rollIds = await Promise.all(updateLocationRolls.map((roll) => roll.RollId));
            const allRolls = await this.defaultEntityManager.find(StockedInRolls_1.StockedInRolls, {
                RollId: typeorm_1.In(rollIds),
            });
            //     // remove rolls which are not found.
            const toUpdateLocationRolls = await Promise.all(allRolls.filter((roll) => updateLocationRolls.find((roll2) => roll2.RollId == roll.RollId)));
            if (toUpdateLocationRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for updating location.', updateLocationRolls));
            }
            else if (toUpdateLocationRolls.length < updateLocationRolls.length) {
                // filter out rolls which have been found out from above request.
                const presentIds = toUpdateLocationRolls.map((roll) => roll.RollId);
                const toUpdateLocationRolls2 = updateLocationRolls.filter((roll) => presentIds.includes(roll.RollId));
                const updatedRolls = await this.transactionsService.updateLocation(toUpdateLocationRolls2);
                const absentIds = rollIds.filter((id) => !presentIds.includes(id));
                throw new common_1.BadRequestException(new ApiResponse_1.default(common_1.HttpStatus.BAD_REQUEST, 'Missing Rolls. Some rolls are not available for updating locations.', {
                    FoundIds: updatedRolls,
                    NotFoundIds: absentIds,
                }));
            }
            //
            //     // filter out rolls which have been found out from above request.
            const presentIds = toUpdateLocationRolls.map((roll) => roll.RollId);
            const toUpdateLocationRolls2 = updateLocationRolls.filter((roll) => presentIds.includes(roll.RollId));
            return await this.transactionsService.updateLocation(toUpdateLocationRolls2);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            else if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(14, ex));
        }
    }
    //
    async updateOrder(updateOrderRolls) {
        try {
            const rollIds = await Promise.all(updateOrderRolls.map((roll) => roll.RollId));
            const allRolls = await this.defaultEntityManager.find(StockedInRolls_1.StockedInRolls, {
                RollId: typeorm_1.In(rollIds),
            });
            //
            //     // remove rolls which are not found.
            const toUpdateOrderRolls = await Promise.all(allRolls.filter((roll) => updateOrderRolls.find((roll2) => roll2.RollId == roll.RollId)));
            console.log("ARRAY IS: " + toUpdateOrderRolls);
            if (toUpdateOrderRolls.length == 0) {
                throw new common_1.NotFoundException(new ApiResponse_1.default(common_1.HttpStatus.NOT_FOUND, 'Invalid Rolls. Rolls are not available for updating order.', updateOrderRolls));
            }
            else if (toUpdateOrderRolls.length < updateOrderRolls.length) {
                // filter out rolls which have been found out from above request.
                const presentIds = toUpdateOrderRolls.map((roll) => roll.RollId);
                const toUpdateOrderRolls2 = updateOrderRolls.filter((roll) => presentIds.includes(roll.RollId));
                const updatedRolls = await this.transactionsService.updateOrder(toUpdateOrderRolls2);
                const absentIds = rollIds.filter((id) => !presentIds.includes(id));
                throw new common_1.BadRequestException(new ApiResponse_1.default(common_1.HttpStatus.BAD_REQUEST, 'Missing Rolls. Some rolls are not available for updating order.', {
                    FoundIds: updatedRolls,
                    NotFoundIds: absentIds,
                }));
            }
            // filter out rolls which have been found out from above request.
            const presentIds = toUpdateOrderRolls.map((roll) => roll.RollId);
            const toUpdateOrderRolls2 = updateOrderRolls.filter((roll) => presentIds.includes(roll.RollId));
            return await this.transactionsService.updateOrder(toUpdateOrderRolls2);
        }
        catch (ex) {
            if (ex instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(ex);
            }
            else if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(15, ex));
        }
    }
    async deletePackingList(packingListCode) {
        try {
            // check if rolls with given packing list code exists.
            // if not return not found exception.
            await this.defaultEntityManager.findOneOrFail(PackingList_1.PackingList, {
                packingListId: packingListCode,
            });
            const afterRemoval = await this.transactionsService.deletePackingList(packingListCode);
            if (afterRemoval.ErrorNumber != 0)
                throw new common_1.BadRequestException(afterRemoval, afterRemoval.ErrorMessage);
            return afterRemoval;
        }
        catch (ex) {
            if (ex instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(ex);
            }
            throw new common_1.InternalServerErrorException(await this.getError(20));
        }
    }
};
__decorate([
    common_1.Put('verify_login'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyLogin_1.default]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "verifyLogin", null);
__decorate([
    common_1.Post('upload_packinglist'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: PackingList_1.PackingList,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "uploadPackingList", null);
__decorate([
    common_1.Post('upload_tag'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: Tag_1.Tag,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "uploadTag", null);
__decorate([
    common_1.Put('assign_tag'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: AssignTag_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "assignTag", null);
__decorate([
    common_1.Post('stockin'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: WarehouseTransaction_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "stockIn", null);
__decorate([
    common_1.Post('stockin_allocation_execution'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: ReturnStock_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "returnStock", null);
__decorate([
    common_1.Post('fabric_inspection'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: FabricInspection_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "fabricInspection", null);
__decorate([
    common_1.Post('allocation'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: AllocatedTo_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "departmentalAllocation", null);
__decorate([
    common_1.Post('stockout'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: WarehouseTransaction_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "stockOut", null);
__decorate([
    common_1.Post('roll_split'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: RollSplit_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "rollSplit", null);
__decorate([
    common_1.Post('roll_split_at_return'),
    common_1.Header('Content-type', 'application/json'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: RollSplit_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "rollSplitAtReturn", null);
__decorate([
    common_1.Put('clear_allocation'),
    common_1.Header('Content-type', 'application/json'),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: ClearAllocation_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "clearAllocation", null);
__decorate([
    common_1.Put('update_location'),
    common_1.Header('Content-type', 'application/json'),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: UpdateLocation_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateLocation", null);
__decorate([
    common_1.Put('update_order'),
    common_1.Header('Content-type', 'application/json'),
    __param(0, common_1.Body(new common_1.ParseArrayPipe({
        items: UpdateOrder_1.default,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateOrder", null);
__decorate([
    common_1.Delete('delete_packinglist'),
    common_1.Header('Content-type', 'application/json'),
    __param(0, common_1.Body('PackingListCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "deletePackingList", null);
TransactionsController = __decorate([
    common_1.Controller('api/v1/transactions'),
    __param(1, typeorm_2.InjectEntityManager()),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        typeorm_1.EntityManager])
], TransactionsController);
exports.TransactionsController = TransactionsController;
//# sourceMappingURL=transactions.controller.js.map