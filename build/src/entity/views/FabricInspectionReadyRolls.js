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
exports.FabricInspectionReadyRolls = void 0;
const typeorm_1 = require("typeorm");
let FabricInspectionReadyRolls = class FabricInspectionReadyRolls {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], FabricInspectionReadyRolls.prototype, "RollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], FabricInspectionReadyRolls.prototype, "NetWeight", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], FabricInspectionReadyRolls.prototype, "ParentRollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], FabricInspectionReadyRolls.prototype, "PackingListId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], FabricInspectionReadyRolls.prototype, "RollStateId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], FabricInspectionReadyRolls.prototype, "RollState", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], FabricInspectionReadyRolls.prototype, "LocationCategory", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], FabricInspectionReadyRolls.prototype, "RackLocatorBin", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], FabricInspectionReadyRolls.prototype, "IsCardAssigned", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], FabricInspectionReadyRolls.prototype, "CardAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], FabricInspectionReadyRolls.prototype, "GeneratedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], FabricInspectionReadyRolls.prototype, "IsChildRoll", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], FabricInspectionReadyRolls.prototype, "ActivityId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], FabricInspectionReadyRolls.prototype, "ActivityRollAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
    }),
    __metadata("design:type", Date)
], FabricInspectionReadyRolls.prototype, "UploadDate", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], FabricInspectionReadyRolls.prototype, "Order", void 0);
FabricInspectionReadyRolls = __decorate([
    typeorm_1.ViewEntity({
        schema: 'Api',
        name: 'vw_FabricInspectionReadyRolls',
    })
], FabricInspectionReadyRolls);
exports.FabricInspectionReadyRolls = FabricInspectionReadyRolls;
//# sourceMappingURL=FabricInspectionReadyRolls.js.map