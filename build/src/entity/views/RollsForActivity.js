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
exports.RollsForActivity = void 0;
const typeorm_1 = require("typeorm");
let RollsForActivity = class RollsForActivity {
};
__decorate([
    typeorm_1.PrimaryColumn({
        type: 'int',
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "RollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "NetWeight", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "ParentRollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "RollStateId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "RollState", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "LocationCategory", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "RackLocatorBin", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "IsCardAssigned", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], RollsForActivity.prototype, "CardAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "GeneratedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "IsChildRoll", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "ActivityId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], RollsForActivity.prototype, "ActivityRollAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "PackingListId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
    }),
    __metadata("design:type", Date)
], RollsForActivity.prototype, "UploadDate", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "PackingListCode", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "Order", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "FabricContent", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 128,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "FabricColor", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "FabricLot", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "FabricType", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "FabricWidth", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "FabricLength", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 8,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "Pieces", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 8,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "ItemCode", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "ItemDescription", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 8,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "Igp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "IgpDate", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "Customer", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "CustomerCode", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "Dcn", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "YarnSupplier", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 8,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "YarnLot", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 8,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "Gsm", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "Supplier", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "SupplierLot", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], RollsForActivity.prototype, "SupplierRollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], RollsForActivity.prototype, "TransactionType", void 0);
RollsForActivity = __decorate([
    typeorm_1.ViewEntity({
        schema: 'Api',
        name: 'vw_RollsAvailableForCuttingActivity',
    })
], RollsForActivity);
exports.RollsForActivity = RollsForActivity;
//# sourceMappingURL=RollsForActivity.js.map