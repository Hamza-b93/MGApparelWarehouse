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
exports.ReportsService = void 0;
const StockedInRollsWithAllocations_1 = require("./../entity/views/StockedInRollsWithAllocations");
const ChildRolls_1 = require("./../entity/views/ChildRolls");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const PackingList_1 = require("../entity/models/PackingList");
const StockSummary_1 = require("../entity/views/StockSummary");
const StockSummaryToday_1 = require("../entity/views/StockSummaryToday");
const DateWiseOrders_1 = require("../entity/views/DateWiseOrders");
const ReadyToWarehouseStockOutRolls_1 = require("../entity/views/ReadyToWarehouseStockOutRolls");
const ReadyToWarehouseStockInRolls_1 = require("../entity/views/ReadyToWarehouseStockInRolls");
const StockedInRolls_1 = require("../entity/views/StockedInRolls");
const StockedOutRolls_1 = require("../entity/views/StockedOutRolls");
const RollStates_1 = require("../entity/models/RollStates");
const Tag_1 = require("../entity/models/Tag");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const CardAssignableRolls_1 = require("../entity/views/CardAssignableRolls");
const FabricInspectionReadyRolls_1 = require("../entity/views/FabricInspectionReadyRolls");
const typeorm_2 = require("typeorm");
const ReturnAllocatedRolls_1 = require("../entity/views/ReturnAllocatedRolls");
const CompleteRollInfo_1 = require("../entity/views/CompleteRollInfo");
const Orders_1 = require("../entity/views/Orders");
const PackingListCodes_1 = require("../entity/views/PackingListCodes");
const SuitableRollsToSplit_1 = require("../entity/views/SuitableRollsToSplit");
const ScannerStockSummary_1 = __importDefault(require("../entity/dtos/ScannerStockSummary"));
let ReportsService = class ReportsService {
    constructor(entityManager) {
        this.entityManager = entityManager;
    }
    getStockSummary() {
        return this.entityManager.find(StockSummary_1.StockSummary);
    }
    getStockSummaryToday() {
        return this.entityManager.find(StockSummaryToday_1.StockSummaryToday);
    }
    async getServiceStockSummary(limit) {
        const scannerSummary = new ScannerStockSummary_1.default();
        const stockSummaryIn = await this.entityManager.find(StockSummaryToday_1.StockSummaryToday, {
            RollStateId: 5,
        });
        scannerSummary.StockedInRolls = 0;
        await Promise.all(stockSummaryIn.map((summary) => (scannerSummary.StockedInRolls += summary.TotalRolls)));
        scannerSummary.StockedInRolls = Number(scannerSummary.StockedInRolls);
        const stockSummaryOut = await this.entityManager.find(StockSummaryToday_1.StockSummaryToday, {
            RollStateId: typeorm_2.In([8, 9, 10, 11, 12, 13, 14, 15, 16]),
        });
        scannerSummary.StockedOutRolls = 0;
        await Promise.all(stockSummaryOut.map((summary) => (scannerSummary.StockedOutRolls += summary.TotalRolls)));
        scannerSummary.StockedOutRolls = Number(scannerSummary.StockedOutRolls);
        scannerSummary.LatestStockInRolls = await this.entityManager.find(StockedInRolls_1.StockedInRolls, {
            where: [{ UpdatedAtDate: new Date().toISOString().slice(0, 10) }],
            order: {
                UpdatedAt: 'DESC',
            },
            skip: 0,
            take: limit,
        });
        scannerSummary.LatestStockOutRolls = await this.entityManager.find(StockedOutRolls_1.StockedOutRolls, {
            where: [{ UpdatedAtDate: new Date().toISOString().slice(0, 10) }],
            order: {
                UpdatedAt: 'DESC',
            },
            skip: 0,
            take: limit,
        });
        return scannerSummary;
    }
    getRollStates() {
        return this.entityManager.find(RollStates_1.RollStates);
    }
    async getPackingList(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(PackingList_1.PackingList)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(PackingList_1.PackingList), options);
    }
    async getTag(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(Tag_1.Tag)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(Tag_1.Tag), options);
    }
    async getRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(CompleteRollInfo_1.CompleteRollInfo)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        // else return everything.
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(CompleteRollInfo_1.CompleteRollInfo), options);
    }
    async getDateWiseOrders(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(DateWiseOrders_1.DateWiseOrders)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(DateWiseOrders_1.DateWiseOrders), options);
    }
    async getReadyToWarehouseStockOutRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(ReadyToWarehouseStockOutRolls_1.ReadyToWarehouseStockOutRolls)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(ReadyToWarehouseStockOutRolls_1.ReadyToWarehouseStockOutRolls), options);
    }
    async getReadyToWarehouseStockInRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(ReadyToWarehouseStockInRolls_1.ReadyToWarehouseStockInRolls)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(ReadyToWarehouseStockInRolls_1.ReadyToWarehouseStockInRolls), options);
    }
    async getStockedInRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(StockedInRolls_1.StockedInRolls)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(StockedInRolls_1.StockedInRolls), options);
    }
    async getStockedInRollsWithAllocations(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(StockedInRollsWithAllocations_1.StockedInRollsWithAllocations)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(StockedInRollsWithAllocations_1.StockedInRollsWithAllocations), options);
    }
    async getStockedOutRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(StockedOutRolls_1.StockedOutRolls)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(StockedOutRolls_1.StockedOutRolls), options);
    }
    async getLatestTransactionsForRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(CompleteRollInfo_1.CompleteRollInfo)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(CompleteRollInfo_1.CompleteRollInfo), options);
    }
    async getChildRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(ChildRolls_1.ChildRolls)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(ChildRolls_1.ChildRolls), options);
    }
    async getPackingListCodes(options, searchBy = null) {
        // search on field otherwise show all results.
        if (searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(PackingListCodes_1.PackingListCodes)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`cast(pl.[PackingListCode] as nvarchar(16)) like '%${searchBy}%'`)
                .orderBy(`pl.[PackingListCode]`, 'ASC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(PackingListCodes_1.PackingListCodes), options);
    }
    async getOrders(options, searchBy = null) {
        // search on field otherwise show all results.
        if (searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(Orders_1.Orders)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[Order] like '%${searchBy}%'`)
                .orderBy(`pl.[Order]`, 'ASC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(Orders_1.Orders), options);
    }
    async getWarehouseReturnPendingApprovalRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(ReturnAllocatedRolls_1.ReturnAllocatedRolls)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(ReturnAllocatedRolls_1.ReturnAllocatedRolls), options);
    }
    async getSuitableRollsToSplit(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(SuitableRollsToSplit_1.SuitableRollsToSplit)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(SuitableRollsToSplit_1.SuitableRollsToSplit), options);
    }
    async getLatestTransactionsForRollId(storedRollId) {
        return this.entityManager.getRepository(CompleteRollInfo_1.CompleteRollInfo).find({
            RollId: storedRollId,
        });
    }
    async getCardsAssignableRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(CardAssignableRolls_1.CardAssignableRolls)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(CardAssignableRolls_1.CardAssignableRolls), options);
    }
    async getFabricInspectionRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(FabricInspectionReadyRolls_1.FabricInspectionReadyRolls)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(FabricInspectionReadyRolls_1.FabricInspectionReadyRolls), options);
    }
    async getReturnAllocatedRolls(options, searchOn = null, searchBy = null) {
        // search on field otherwise show all results.
        if (searchOn != null && searchBy != null) {
            const queryBuilder = this.entityManager
                .getRepository(ReturnAllocatedRolls_1.ReturnAllocatedRolls)
                .createQueryBuilder('pl');
            queryBuilder
                .where(`pl.[${searchOn}] like '%${searchBy}%'`)
                .orderBy(`pl.[${searchOn}]`, 'DESC')
                .getMany();
            return nestjs_typeorm_paginate_1.paginate(queryBuilder, options);
        }
        return nestjs_typeorm_paginate_1.paginate(this.entityManager.getRepository(ReturnAllocatedRolls_1.ReturnAllocatedRolls), options);
    }
};
ReportsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectEntityManager()),
    __metadata("design:paramtypes", [typeorm_2.EntityManager])
], ReportsService);
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map