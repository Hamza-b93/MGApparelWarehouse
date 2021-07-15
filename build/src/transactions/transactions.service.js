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
exports.TransactionsService = void 0;
const LatestRollAllocations_1 = require("./../entity/views/LatestRollAllocations");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const PackingList_1 = require("../entity/models/PackingList");
const Tag_1 = require("../entity/models/Tag");
const Rolls_1 = require("../entity/models/Rolls");
const Users_1 = require("../entity/models/Users");
const CompleteRollInfo_1 = require("../entity/views/CompleteRollInfo");
const ApiResponse_1 = __importDefault(require("../entity/dtos/ApiResponse"));
const ErrorsList_1 = require("../entity/models/ErrorsList");
const Allocations_1 = require("../entity/models/Allocations");
const RollStates_1 = require("../entity/models/RollStates");
let TransactionsService = class TransactionsService {
    constructor(defaultEntityManager) {
        this.defaultEntityManager = defaultEntityManager;
        // local copy all errors stored in memory to avoid fetching errors from database repeatedly.
        this.errorsList = null;
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
    // returns a promise, verifies user login information.
    async VerifyLogin(userLogin) {
        try {
            return await this.defaultEntityManager.findOneOrFail(Users_1.Users, {
                userName: userLogin.UserName,
                userPassword: userLogin.UserPassword,
            });
        }
        catch {
            return await this.getError(2, {
                userName: userLogin.UserName,
                userPassword: userLogin.UserPassword,
            });
        }
    }
    // uploads packing list to database.
    // it uploads full packing list or fails in all or nothing manner.
    async uploadPackingList(toUploadPackingList) {
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
                if (packingList.receiptNo ?? null)
                    packingList.receiptNo = packingList.receiptNo.toUpperCase();
                // if (packingList.receiptDate ?? null)
                //   packingList.receiptDate = packingList.receiptDate.toUpperCase();
                if (packingList.prNo ?? null)
                    packingList.prNo = packingList.prNo.toUpperCase();
                // if (packingList.prDate ?? null)
                //   packingList.prDate = packingList.prDate.toUpperCase();
                if (packingList.gatePassNo ?? null)
                    packingList.gatePassNo = packingList.gatePassNo.toUpperCase();
                if (packingList.po ?? null)
                    packingList.po = packingList.po.toUpperCase();
                if (packingList.inspectionNo ?? null)
                    packingList.inspectionNo = packingList.inspectionNo.toUpperCase();
                if (packingList.biltyNo ?? null)
                    packingList.biltyNo = packingList.biltyNo.toUpperCase();
                if (packingList.do ?? null)
                    packingList.do = packingList.do.toUpperCase();
                if (packingList.driverName ?? null)
                    packingList.driverName = packingList.driverName.toUpperCase();
                if (packingList.vehicleNo ?? null)
                    packingList.vehicleNo = packingList.vehicleNo.toUpperCase();
                // if (packingList.rolls ?? null)
                //   packingList.rolls = packingList.rolls.toUpperCase();
            });
            await this.defaultEntityManager.transaction(async (batchManager) => {
                const uploadedPackingList = await batchManager.save(PackingList_1.PackingList, toUploadPackingList, {
                    chunk: 500,
                });
                const toUploadRolls = await Promise.all(toUploadPackingList.map((toUpload, index) => {
                    const roll = new Rolls_1.Rolls();
                    roll.netWeight = toUpload.rollWeight;
                    roll.netLength = toUpload.uploadedLength;
                    roll.rollStateId = 1;
                    roll.isFresh = true;
                    roll.packingListId = uploadedPackingList[index].packingListId;
                    console.log(uploadedPackingList[index]);
                    return roll;
                }));
                console.log(toUploadRolls);
                //packingListId: uploadedPackingList.identifiers[index].packingListId,
                await batchManager.save(Rolls_1.Rolls, toUploadRolls, {
                    chunk: 500,
                });
            });
            return await this.getError(1);
        }
        catch (ex) {
            return await this.getError(3, ex);
        }
    }
    // uploads tag list to database.
    // it uploads full tag list or fails in all or nothing manner.
    async uploadTagList(toUploadTagList) {
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
            await this.defaultEntityManager.transaction(async (batchManager) => {
                const uploadedTagList = await batchManager.save(Tag_1.Tag, toUploadTagList, {
                    chunk: 500,
                });
            });
            return await this.getError(1);
        }
        catch (ex) {
            return await this.getError(3, ex);
        }
    }
    // update card to a given roll.
    // if roll is a child roll, do not change its roll state.
    async assignCard(assignTag) {
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
        const afterwards = await Promise.allSettled(assignTag.map(async (roll) => {
            try {
                const rollInfo = await this.defaultEntityManager.findOneOrFail(CompleteRollInfo_1.CompleteRollInfo, {
                    RollId: roll.RollId,
                });
                this.defaultEntityManager.transaction(async (batchManager) => {
                    await batchManager.update(Rolls_1.Rolls, roll.RollId, rollInfo.IsChildRoll == 0 ? toRoll : toChildRoll);
                    // const tag = new Tag();
                    // tag.roll = ?
                    // tag.tagId = ?
                    // batchManager.save(tag);
                    await batchManager.update(Tag_1.Tag, {
                        tagId: roll.TagId,
                    }, {
                        rollId: roll.RollId
                    });
                    //
                });
                console.log(roll.RollId);
                return await this.getError(1, roll);
            }
            catch (ex) {
                return await this.getError(9, roll);
            }
        }));
        return Promise.all(afterwards.map(async (result) => {
            if (result.status == 'fulfilled') {
                return await this.getError(1, {
                    rollId: result.value.Data.rollId,
                    netWeight: result.value.Data.netWeight,
                    isCardAssigned: 1,
                    cardAssignmentTimestamp: new Date(),
                });
            }
            else {
                return await this.getError(9, result.reason);
            }
        }));
    }
    //
    // // stock in from card assigned.
    // // if roll is sampling dedicated, do not push into fabric inspection,
    // // instead migrate into stock in.
    async stockInCardAssigned(toStockInRolls) {
        try {
            const rollIds = toStockInRolls.map((roll) => roll.rollId);
            const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
                rollId: typeorm_2.In(rollIds),
            });
            const allCompleteRolls = await this.defaultEntityManager.find(CompleteRollInfo_1.CompleteRollInfo, {
                RollId: typeorm_2.In(rollIds),
            });
            const toUpdateRolls = await Promise.all(toStockInRolls.map((toStockInRoll) => {
                const currentRoll = allRolls.find((roll) => roll.rollId == toStockInRoll.rollId);
                const currentCompleteRoll = allCompleteRolls.find((roll) => roll.RollId == toStockInRoll.rollId);
                // if roll is sampling induced, just stock it in.
                if (currentCompleteRoll.ForSampling == 1)
                    currentRoll.rollStateId = 5;
                else
                    currentRoll.rollStateId = 3;
                currentRoll.transactionAt = 'WAREHOUSE';
                currentRoll.antenna = toStockInRoll.Antenna;
                currentRoll.isTransactionManual = toStockInRoll.IsManual ? true : false;
                currentRoll.activityId = null;
                currentRoll.activityRollAssignmentTimestamp = null;
                currentRoll.rackLocatorBin = null;
                currentRoll.lastAllocationId = null;
                currentRoll.updatedAtDate = new Date();
                return currentRoll;
            }));
            const updatedRolls = await this.defaultEntityManager.save(toUpdateRolls, {
                chunk: 500,
            });
            return await this.getError(1, updatedRolls);
        }
        catch (ex) {
            return await this.getError(9, toStockInRolls);
        }
    }
    // if roll is returning. do not stock in,
    // instead map an allocation to warehouse from returning department.
    async stockInAllocation(toAllocateRolls) {
        try {
            const rollIds = toAllocateRolls.map((roll) => roll.rollId);
            const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
                rollId: typeorm_2.In(rollIds),
            });
            const currentAllocations = await this.defaultEntityManager.find(Allocations_1.Allocations, {
                rollId: typeorm_2.In(rollIds),
                isLatest: 1,
            });
            // set previous allocations to non-latest.
            currentAllocations.map((allocation) => ((allocation.isLatest = 0), (allocation.updatedAtDate = new Date())));
            const rollsAndAllocations = await Promise.all(allRolls.map((toAllocateRoll) => {
                const allocation = new Allocations_1.Allocations();
                allocation.rollId = toAllocateRoll.rollId;
                allocation.allocationStatus = 'PENDING';
                allocation.allocatedTo = 'WAREHOUSE';
                allocation.isLatest = 1;
                toAllocateRoll.transactionAt = 'WAREHOUSE';
                toAllocateRoll.activityId = null;
                toAllocateRoll.activityRollAssignmentTimestamp = null;
                toAllocateRoll.rackLocatorBin = null;
                toAllocateRoll.lastAllocationId = null;
                toAllocateRoll.updatedAtDate = new Date();
                return [allocation, toAllocateRoll];
            }));
            const allocations = rollsAndAllocations.map((ra) => ra[0]);
            const rollsToSave = rollsAndAllocations.map((ra) => ra[1]);
            const changes = await this.defaultEntityManager.transaction(async (batchManager) => {
                await batchManager.save(currentAllocations);
                const savedAllocations = await batchManager.save(allocations);
                const rolls = await Promise.all(rollsToSave.map((roll) => {
                    const savedAllocation = savedAllocations.find((allocation) => allocation.rollId == roll.rollId);
                    // assign last allocation id to roll;
                    roll.lastAllocationId = savedAllocation.allocationId;
                    return roll;
                }));
                console.log(rolls);
                const savedRolls = await batchManager.save(rolls);
                return [savedAllocations, savedRolls];
            });
            return await this.getError(1, changes);
        }
        catch (ex) {
            return await this.getError(5, toAllocateRolls);
        }
    }
    // // stock in or rejects from return allocation.
    async returnStock(toReturnRolls) {
        const rollIds = toReturnRolls.map((roll) => roll.RollId);
        const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
            rollId: typeorm_2.In(rollIds),
        });
        console.log(rollIds);
        //   // fetching pending allocations.
        const pendingAllocations = await this.defaultEntityManager.find(LatestRollAllocations_1.LatestRollAllocations, {
            RollId: typeorm_2.In(rollIds),
        });
        const pendingAllocationIds = await Promise.all(pendingAllocations.map((allocation) => allocation.AllocationId));
        const allAllocations = await this.defaultEntityManager.find(Allocations_1.Allocations, {
            allocationId: typeorm_2.In(pendingAllocationIds),
        });
        const changeLog = await Promise.all(toReturnRolls.map(async (toReturnRoll) => {
            const currentRoll = allRolls.find((roll) => roll.rollId == toReturnRoll.RollId);
            //       // find all previous pending allocations.
            const currentAllocations = allAllocations.filter((allocation) => allocation.rollId == currentRoll.rollId);
            //       // reject all previous allocations.
            let updatedAllocations = await Promise.all(currentAllocations.map((allocation) => {
                allocation.allocationStatus = 'REJECTED';
                allocation.updatedAtDate = new Date();
                return allocation;
            }));
            // remove allocation from roll.
            // keeping last allocation id saved to be used in if condition.
            const lastAlocationId = currentRoll.lastAllocationId;
            currentRoll.lastAllocationId = null;
            currentRoll.transactionAt = 'WAREHOUSE';
            currentRoll.activityId = null;
            currentRoll.activityRollAssignmentTimestamp = null;
            currentRoll.rackLocatorBin = null;
            currentRoll.isTransactionManual = false;
            currentRoll.antenna = null;
            currentRoll.updatedAtDate = new Date();
            // check if stock in is accepted.
            if (toReturnRoll.IsRejected == false) {
                // stock in roll upon accept.
                currentRoll.rollStateId = 5;
                currentRoll.isFresh = false;
                // set last allocation of roll to be accepted.
                updatedAllocations = updatedAllocations.map((allocation) => {
                    if (allocation.allocationId == lastAlocationId) {
                        allocation.allocationStatus = 'EXECUTED';
                        allocation.updatedAt = new Date();
                    }
                    return allocation;
                });
            }
            return [currentRoll, updatedAllocations];
        }));
        const toUpdateRolls = await Promise.all(changeLog.map((change) => change[0]));
        const toUpdateAllocations = await Promise.all(changeLog.map((change) => change[1]));
        try {
            const updatedLog = await this.defaultEntityManager.transaction(async (batchManager) => {
                const updatedRolls = await batchManager.save(toUpdateRolls);
                const updatedAllocations = await Promise.all(toUpdateAllocations.map((allocation) => batchManager.save(allocation)));
                return [updatedRolls, updatedAllocations];
            });
            return await this.getError(1, updatedLog);
        }
        catch (ex) {
            return await this.getError(5, toReturnRolls);
        }
    }
    // // stocks in roll from fabric inspection from accept/reject handheld app.
    // // handles fabric inspection at other departments than warehouse as well.
    async fabricInspection(toFabricInspectionRolls) {
        const rollIds = toFabricInspectionRolls.map((roll) => roll.RollId);
        const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
            rollId: typeorm_2.In(rollIds),
        });
        const allCompleteRolls = await this.defaultEntityManager.find(CompleteRollInfo_1.CompleteRollInfo, {
            RollId: typeorm_2.In(rollIds),
        });
        const toUpdateRolls = await Promise.all(toFabricInspectionRolls.map(async (toFabricInspectionRoll) => {
            const currentRoll = allRolls.find((roll) => roll.rollId == toFabricInspectionRoll.RollId);
            const currentCompleteRoll = allCompleteRolls.find((roll) => roll.RollId == toFabricInspectionRoll.RollId);
            // update roll for fabric inspection.
            currentRoll.lastAllocationId = null;
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
            if (toFabricInspectionRoll.IsRejected)
                currentRoll.rollStateId = 4;
            else if (currentRoll.rollStateId == 3)
                currentRoll.rollStateId = 5;
            return currentRoll;
        }));
        try {
            const changeLog = await this.defaultEntityManager.transaction(async (batchManager) => batchManager.save(toUpdateRolls));
            return await this.getError(1, changeLog);
        }
        catch (ex) {
            return await this.getError(7, toFabricInspectionRolls);
        }
    }
    // // allocates a roll to a department.
    // // once an allocation is received, reject all previous allocations.
    async departmentalAllocation(toAllocateRolls) {
        const rollIds = toAllocateRolls.map((roll) => roll.RollId);
        const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
            rollId: typeorm_2.In(rollIds),
        });
        const pendingAllocations = await this.defaultEntityManager.find(LatestRollAllocations_1.LatestRollAllocations, {
            RollId: typeorm_2.In(rollIds),
        });
        const pendingAllocationIds = await Promise.all(pendingAllocations.map((allocation) => allocation.AllocationId));
        const allAllocations = await this.defaultEntityManager.find(Allocations_1.Allocations, {
            allocationId: typeorm_2.In(pendingAllocationIds),
        });
        const changes = await Promise.all(toAllocateRolls.map(async (toFabricInspectionRoll) => {
            const currentRoll = allRolls.find((roll) => roll.rollId == toFabricInspectionRoll.RollId);
            //       // find all previous pending allocations.
            const currentAllocations = allAllocations.filter((allocation) => allocation.rollId == toFabricInspectionRoll.RollId);
            // setting up promise return variable.
            const promiseReturn = [];
            // reject all previous allocations.
            await Promise.all(currentAllocations.map((allocation) => {
                allocation.isLatest = 0;
                allocation.allocationStatus = 'REJECTED';
                allocation.updatedAtDate = new Date();
            }));
            promiseReturn.push(currentAllocations);
            // add a new allocation.
            const allocation = new Allocations_1.Allocations();
            allocation.rollId = currentRoll.rollId;
            allocation.allocationStatus = 'PENDING';
            allocation.allocatedTo =
                toFabricInspectionRoll.AllocatedTo.toUpperCase();
            allocation.isLatest = 1;
            promiseReturn.push(allocation);
            return promiseReturn;
        }));
        const toUpdateAllocations = changes.map((change) => change[0]);
        const toInsertAllocation = changes.map((change) => change[1]);
        try {
            const changeLog = await this.defaultEntityManager.transaction(async (batchManager) => {
                const updatedAllocations = await Promise.all(toUpdateAllocations.map(async (allocation) => await batchManager.save(allocation)));
                const insertedAllocation = await batchManager.save(toInsertAllocation);
                const updatedRolls = await Promise.all(insertedAllocation.map(async (allocation) => {
                    const roll = await batchManager.findOneOrFail(Rolls_1.Rolls, allocation.rollId);
                    roll.lastAllocationId = allocation.allocationId;
                    roll.updatedAtDate = new Date();
                    return await batchManager.save(roll);
                }));
                return [updatedAllocations, updatedRolls];
            });
            return await this.getError(1, changeLog);
        }
        catch (ex) {
            return await this.getError(8, toAllocateRolls);
        }
    }
    // stocks out roll from warehouse.
    // if roll is rejected in fabric inspection, skip its allocation check.
    // upon stockout, remove rack, location, bin of rolls.
    async stockOut(toStockOutRolls) {
        const rollIds = toStockOutRolls.map((roll) => roll.rollId);
        const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
            rollId: typeorm_2.In(rollIds),
        });
        const pendingAllocations = await this.defaultEntityManager.find(LatestRollAllocations_1.LatestRollAllocations, {
            RollId: typeorm_2.In(rollIds),
        });
        const pendingAllocationIds = await Promise.all(pendingAllocations.map((allocation) => allocation.AllocationId));
        const allAllocations = await this.defaultEntityManager.find(Allocations_1.Allocations, {
            allocationId: typeorm_2.In(pendingAllocationIds),
        });
        const toSet = await Promise.all(toStockOutRolls.map(async (toStockOutRoll) => {
            const currentRoll = allRolls.find((roll) => roll.rollId == toStockOutRoll.rollId);
            // setting up promise return variable.
            const promiseReturn = [];
            // to differentiate between fabric inspection rejected and allocated rolls.
            promiseReturn.push(currentRoll.rollStateId);
            // if roll is fabric inspection rejected. just stock it out.
            // no need to find out its allocations.
            if (currentRoll.rollStateId == 4)
                currentRoll.rollStateId = 6;
            else {
                // find previous pending allocation.
                const rollAllocation = allAllocations.find((allocation) => allocation.rollId == currentRoll.rollId);
                rollAllocation.allocationStatus = 'EXECUTED';
                rollAllocation.updatedAtDate = new Date();
                promiseReturn.push(rollAllocation);
                const rollStateOther = await this.defaultEntityManager.findOneOrFail(RollStates_1.RollStates, {
                    rollState: `${rollAllocation.allocatedTo} WIP`,
                    locationCategory: rollAllocation.allocatedTo,
                });
                currentRoll.rollStateId = rollStateOther.rollStateId;
            }
            currentRoll.rackLocatorBin = null; // upon exit, remove rack location bin of roll.
            currentRoll.lastAllocationId = null; // important to set last allocation id to null.
            currentRoll.transactionAt = 'WAREHOUSE';
            currentRoll.isFresh = false; // to differentiate between returning and uploaded stock in.
            currentRoll.activityId = null;
            currentRoll.activityRollAssignmentTimestamp = null;
            currentRoll.isTransactionManual = toStockOutRoll.IsManual ? true : false;
            currentRoll.antenna = toStockOutRoll.Antenna;
            currentRoll.updatedAtDate = new Date();
            promiseReturn.push(currentRoll);
            return promiseReturn;
        }));
        // filter out all fabric inspection rejected rolls.
        const rejectedRolls = toSet.filter((change) => change[0] == 4);
        // filter out department allocated rolls.
        const departmentalAllocationRolls = toSet.filter((change) => change[0] != 4);
        const toUpdateRejectedRolls = rejectedRolls.map((change) => change[1]);
        const toUpdateDeptAllocatedRollAllocations = departmentalAllocationRolls.map((change) => change[1]);
        const toUpdateDeptAllocatedRolls = departmentalAllocationRolls.map((change) => change[2]);
        try {
            const changeLogRejectedRolls = await this.defaultEntityManager.transaction(async (batchManager) => {
                const updatedRolls = await batchManager.save(toUpdateRejectedRolls);
                return updatedRolls;
            });
            const changeLogAllocatedRolls = await this.defaultEntityManager.transaction(async (batchManager) => {
                const updatedAllocations = await Promise.all(toUpdateDeptAllocatedRollAllocations.map(async (allocation) => await batchManager.save(allocation)));
                const updatedRolls = await batchManager.save(toUpdateDeptAllocatedRolls);
                return [updatedAllocations, updatedRolls];
            });
            return await this.getError(1, [
                changeLogRejectedRolls,
                changeLogAllocatedRolls,
            ]);
        }
        catch (ex) {
            return await this.getError(13, toStockOutRolls);
        }
    }
    // splits given roll into two rolls as per given weight.
    // rolls with allocations pending are not allowed to split.
    // handles split at return as well.
    async rollSplit(toSplitRolls) {
        const rollIds = toSplitRolls.map((roll) => roll.RollId);
        const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
            rollId: typeorm_2.In(rollIds),
        });
        const allCompleteRolls = await this.defaultEntityManager.find(CompleteRollInfo_1.CompleteRollInfo, {
            RollId: typeorm_2.In(rollIds),
        });
        const toSet = await Promise.all(toSplitRolls.map(async (toSplitRoll) => {
            const currentRoll = allRolls.find((roll) => roll.rollId == toSplitRoll.RollId);
            const currentCompleteRoll = allCompleteRolls.find((roll) => roll.RollId == toSplitRoll.RollId);
            console.log(currentRoll.packingListId);
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
                throw new common_1.BadRequestException(common_1.HttpStatus.BAD_REQUEST, 'Bad Rolls Split.');
            // make child roll.
            const ratio = (currentRoll.netWeight / currentRoll.netLength);
            const childRoll = new Rolls_1.Rolls();
            childRoll.netLength = (toSplitRoll.NetLength);
            childRoll.netWeight = toSplitRoll.NetLength * ratio; //toSplitRoll.SplitWeight;
            childRoll.packingListId = currentRoll.packingListId;
            childRoll.parentRollId = currentRoll.rollId;
            childRoll.isChildRoll = 1;
            childRoll.isFresh = childRollStateId == 5 ? true : false;
            childRoll.rollStateId = childRollStateId;
            childRoll.generatedAt = currentCompleteRoll.LocationCategory;
            childRoll.isCardAssigned = 0;
            childRoll.cardAssignmentTimestamp = null;
            childRoll.transactionAt = currentCompleteRoll.LocationCategory;
            childRoll.lastAllocationId = null;
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
        }));
        const toInsertChildRolls = toSet.map((change) => change[0]);
        const toUpdateRolls = toSet.map((change) => change[1]);
        try {
            const changeLog = await this.defaultEntityManager.transaction(async (batchManager) => {
                const insertedChildRolls = await batchManager.save(toInsertChildRolls);
                const updatedRolls = await batchManager.save(toUpdateRolls);
                return [insertedChildRolls, updatedRolls];
            });
            return await this.getError(1, changeLog);
        }
        catch (ex) {
            return await this.getError(10, ex);
        }
    }
    // clears all previous allocations.
    async clearAllocation(toClearAllocationRolls) {
        const rollIds = toClearAllocationRolls.map((roll) => roll.RollId);
        const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
            rollId: typeorm_2.In(rollIds),
        });
        const allAllocations = await this.defaultEntityManager.find(Allocations_1.Allocations, {
            rollId: typeorm_2.In(rollIds),
            allocationStatus: 'PENDING',
        });
        const toSet = await Promise.all(toClearAllocationRolls.map(async (toClearAllocationRoll) => {
            const currentRoll = allRolls.find((roll) => roll.rollId == toClearAllocationRoll.RollId);
            // find all previous pending allocations.
            const currentAllocations = allAllocations.filter((allocation) => allocation.rollId == toClearAllocationRoll.RollId);
            // setting up promise return variable.
            const promiseReturn = [];
            // reject all previous allocations.
            await Promise.all(currentAllocations.map((allocation) => {
                // reject all allocations except for one which is assigned to roll.
                allocation.allocationStatus = 'REJECTED';
                allocation.updatedAtDate = new Date();
            }));
            promiseReturn.push(currentAllocations);
            // important to set last allocation id to null.
            currentRoll.lastAllocationId = null;
            currentRoll.updatedAtDate = new Date();
            promiseReturn.push(currentRoll);
            return promiseReturn;
        }));
        const toUpdateAllocations = toSet.map((change) => change[0]);
        const toUpdateRolls = toSet.map((change) => change[1]);
        try {
            const changeLog = await this.defaultEntityManager.transaction(async (batchManager) => {
                const updatedAllocations = await Promise.all(toUpdateAllocations.map(async (allocation) => await batchManager.save(allocation)));
                const updatedRolls = await batchManager.save(toUpdateRolls);
                return [updatedAllocations, updatedRolls];
            });
            return await this.getError(1, changeLog);
        }
        catch (ex) {
            return await this.getError(19, toClearAllocationRolls);
        }
    }
    // update roll location.
    async updateLocation(toUpdateLocationRolls) {
        const rollIds = toUpdateLocationRolls.map((roll) => roll.RollId);
        const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
            rollId: typeorm_2.In(rollIds),
        });
        const toSet = await Promise.all(toUpdateLocationRolls.map(async (toUpdateLocationRoll) => {
            const currentRoll = allRolls.find((roll) => roll.rollId == toUpdateLocationRoll.RollId);
            // setting up promise return variable.
            const promiseReturn = [];
            // important to set last allocation id to null.
            currentRoll.rackLocatorBin = `R${toUpdateLocationRoll.Location.Rack ?? ''}-L${toUpdateLocationRoll.Location.Locator ?? ''}-B${toUpdateLocationRoll.Location.Bin ?? ''}`;
            currentRoll.updatedAtDate = new Date();
            promiseReturn.push(currentRoll);
            return promiseReturn;
        }));
        const toUpdateRolls = toSet.map((change) => change[0]);
        try {
            const changeLog = await this.defaultEntityManager.transaction(async (batchManager) => await batchManager.save(toUpdateRolls));
            return await this.getError(1, changeLog);
        }
        catch (ex) {
            return await this.getError(14, toUpdateLocationRolls);
        }
    }
    // // update order for a given roll.
    async updateOrder(toUpdateOrderRolls) {
        const rollIds = toUpdateOrderRolls.map((roll) => roll.RollId);
        const allRolls = await this.defaultEntityManager.find(Rolls_1.Rolls, {
            rollId: typeorm_2.In(rollIds),
        });
        const allPackingListIds = allRolls.map((roll) => roll.packingListId);
        const allPackingListRolls = await this.defaultEntityManager.find(PackingList_1.PackingList, {
            packingListId: typeorm_2.In(allPackingListIds),
        });
        const toUpdateRolls = await Promise.all(toUpdateOrderRolls.map(async (toUpdateOrderRoll) => {
            const currentRoll = allRolls.find((roll) => roll.rollId == toUpdateOrderRoll.RollId);
            const currentPackingListRoll = allPackingListRolls.find((roll) => roll.packingListId == currentRoll.packingListId);
            currentPackingListRoll.order = toUpdateOrderRoll.Order.toUpperCase();
            return currentPackingListRoll;
        }));
        try {
            const changeLog = await this.defaultEntityManager.transaction(async (batchManager) => await batchManager.save(toUpdateRolls));
            return await this.getError(1, changeLog);
        }
        catch (ex) {
            return await this.getError(15, toUpdateOrderRolls);
        }
    }
    // // removes packing list.
    async deletePackingList(packingListCode) {
        try {
            const removal = await this.defaultEntityManager.query(`execute Api.sp_DeletePackingList ${packingListCode};`);
            if (removal[0].errorNumber != 0)
                throw new common_1.InternalServerErrorException(removal, removal[0].errorMessage);
            return await this.getError(1);
        }
        catch (ex) {
            return await this.getError(20);
        }
    }
};
TransactionsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectEntityManager()),
    __metadata("design:paramtypes", [typeorm_2.EntityManager])
], TransactionsService);
exports.TransactionsService = TransactionsService;
//# sourceMappingURL=transactions.service.js.map