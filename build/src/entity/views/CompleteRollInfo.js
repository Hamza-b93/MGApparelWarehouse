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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteRollInfo = void 0;
const typeorm_1 = require("typeorm");
let CompleteRollInfo = class CompleteRollInfo {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "RollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], CompleteRollInfo.prototype, "CreatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], CompleteRollInfo.prototype, "UpdatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
    }),
    __metadata("design:type", Date)
], CompleteRollInfo.prototype, "UpdatedAtDate", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "NetWeight", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "ParentRollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "IsChildRoll", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bit',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "IsFresh", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "GeneratedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "IsCardAssigned", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], CompleteRollInfo.prototype, "CardAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "TransactionAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "LastAllocationId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "ActivityId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], CompleteRollInfo.prototype, "ActivityRollAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "RackLocatorBin", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bit',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "IsTransactionManual", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "Antenna", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "RollStateId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "RollState", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "LocationCategory", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "PackingListId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
    }),
    __metadata("design:type", Date)
], CompleteRollInfo.prototype, "UploadDate", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "Order", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 128,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "Color", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "Lot", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "FabricConstruction", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], CompleteRollInfo.prototype, "Supplier", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], CompleteRollInfo.prototype, "ForSampling", void 0);
CompleteRollInfo = __decorate([
    typeorm_1.ViewEntity({
        schema: 'Api',
        name: 'vw_Rolls',
    })
], CompleteRollInfo);
exports.CompleteRollInfo = CompleteRollInfo;
//# sourceMappingURL=CompleteRollInfo.js.map