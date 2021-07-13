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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const reports_service_1 = require("./reports.service");
const common_1 = require("@nestjs/common");
const Rolls_1 = require("../entity/models/Rolls");
const Tag_1 = require("../entity/models/Tag");
const typeorm_1 = require("typeorm");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getStockSummary() {
        return this.reportsService.getStockSummary();
    }
    getStockSummaryToday() {
        return this.reportsService.getStockSummaryToday();
    }
    getServiceStockSummary(limit = 10) {
        return this.reportsService.getServiceStockSummary(limit);
    }
    async getPackingList(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getPackingList({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getTag(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getTag({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getDateWiseOrders(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getDateWiseOrders({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getReadyToWarehouseStockOutRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getReadyToWarehouseStockOutRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getReadyToWarehouseStockInRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getReadyToWarehouseStockInRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getStockedInRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getStockedInRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getStockedInRollsWithAllocations(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getStockedInRollsWithAllocations({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getStockedOutRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getStockedOutRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getPackingListCodes(page = 1, limit = 10, searchBy = null) {
        return this.reportsService.getPackingListCodes({
            page,
            limit,
        }, searchBy);
    }
    async getRollStates() {
        return this.reportsService.getRollStates();
    }
    async getLatestTransactionsForRolls(page = 1, limit = 11, searchOn = null, searchBy = null) {
        return this.reportsService.getLatestTransactionsForRolls({
            page,
            limit,
        }, searchOn, searchBy);
        console.log(searchBy);
    }
    async getChildRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getChildRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getOrders(page = 1, limit = 10, searchBy = null) {
        return this.reportsService.getOrders({
            page,
            limit,
        }, searchBy);
    }
    async getWarehouseReturnPendingApprovalRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getWarehouseReturnPendingApprovalRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getSuitableRollsToSplit(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getSuitableRollsToSplit({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getAll(tagId) {
        return typeorm_1.getRepository(Tag_1.Tag).findOne(tagId);
        const result = await typeorm_1.getRepository(Tag_1.Tag).findOne(tagId);
        console.log(result);
        console.log(result.rollId);
        const storedRollId = result.rollId;
        console.log(storedRollId);
        const newResult = await typeorm_1.getRepository(Rolls_1.Rolls).findOne(storedRollId);
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
    async getCardsAssignableRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getCardsAssignableRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getFabricInspectionReadyRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getFabricInspectionRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
    async getReturnAllocatedRolls(page = 1, limit = 10, searchOn = null, searchBy = null) {
        return this.reportsService.getReturnAllocatedRolls({
            page,
            limit,
        }, searchOn, searchBy);
    }
};
__decorate([
    common_1.Get('stock_summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStockSummary", null);
__decorate([
    common_1.Get('stock_summary_today'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStockSummaryToday", null);
__decorate([
    common_1.Get('service_stock_summary'),
    __param(0, common_1.Query('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getServiceStockSummary", null);
__decorate([
    common_1.Get('packinglist'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPackingList", null);
__decorate([
    common_1.Get('tag'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTag", null);
__decorate([
    common_1.Get('rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getRolls", null);
__decorate([
    common_1.Get('datewise_orders'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDateWiseOrders", null);
__decorate([
    common_1.Get('ready_to_stockout_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReadyToWarehouseStockOutRolls", null);
__decorate([
    common_1.Get('ready_to_stockin_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReadyToWarehouseStockInRolls", null);
__decorate([
    common_1.Get('stockedin_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStockedInRolls", null);
__decorate([
    common_1.Get('stockedin_rolls_with_allocations'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStockedInRollsWithAllocations", null);
__decorate([
    common_1.Get('stockedout_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStockedOutRolls", null);
__decorate([
    common_1.Get('packinglist_codes'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPackingListCodes", null);
__decorate([
    common_1.Get('roll_states'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getRollStates", null);
__decorate([
    common_1.Get('latest_transactions_for_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLatestTransactionsForRolls", null);
__decorate([
    common_1.Get('child_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getChildRolls", null);
__decorate([
    common_1.Get('orders'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getOrders", null);
__decorate([
    common_1.Get('warehouse_return_pending_approval_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getWarehouseReturnPendingApprovalRolls", null);
__decorate([
    common_1.Get('suitable_rolls_to_split'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSuitableRollsToSplit", null);
__decorate([
    common_1.Get('latest_transactions_for_rollid'),
    __param(0, common_1.Query("tagId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAll", null);
__decorate([
    common_1.Get('cards_assignable_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCardsAssignableRolls", null);
__decorate([
    common_1.Get('fabric_inspection_ready_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getFabricInspectionReadyRolls", null);
__decorate([
    common_1.Get('return_allocated_rolls'),
    __param(0, common_1.Query('page', common_1.ParseIntPipe)),
    __param(1, common_1.Query('limit', common_1.ParseIntPipe)),
    __param(2, common_1.Query('searchOn')),
    __param(3, common_1.Query('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReturnAllocatedRolls", null);
ReportsController = __decorate([
    common_1.Controller('api/v1/reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
exports.ReportsController = ReportsController;
//# sourceMappingURL=reports.controller.js.map