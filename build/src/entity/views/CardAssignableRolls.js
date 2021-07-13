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
exports.CardAssignableRolls = void 0;
const typeorm_1 = require("typeorm");
let CardAssignableRolls = class CardAssignableRolls {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], CardAssignableRolls.prototype, "RollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], CardAssignableRolls.prototype, "PackingListId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], CardAssignableRolls.prototype, "ParentRollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], CardAssignableRolls.prototype, "NetWeight", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], CardAssignableRolls.prototype, "RollStateId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], CardAssignableRolls.prototype, "RollState", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], CardAssignableRolls.prototype, "LocationCategory", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], CardAssignableRolls.prototype, "RackLocatorBin", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], CardAssignableRolls.prototype, "IsCardAssigned", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], CardAssignableRolls.prototype, "CardAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 16,
    }),
    __metadata("design:type", String)
], CardAssignableRolls.prototype, "GeneratedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'smallint',
    }),
    __metadata("design:type", Number)
], CardAssignableRolls.prototype, "IsChildRoll", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], CardAssignableRolls.prototype, "ActivityId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], CardAssignableRolls.prototype, "ActivityRollAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
    }),
    __metadata("design:type", Date)
], CardAssignableRolls.prototype, "UploadDate", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], CardAssignableRolls.prototype, "Order", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 128,
    }),
    __metadata("design:type", String)
], CardAssignableRolls.prototype, "Color", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], CardAssignableRolls.prototype, "Lot", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], CardAssignableRolls.prototype, "Supplier", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], CardAssignableRolls.prototype, "FabricConstruction", void 0);
CardAssignableRolls = __decorate([
    typeorm_1.ViewEntity({
        schema: 'Api',
        name: 'vw_CardAssignableRolls',
    })
], CardAssignableRolls);
exports.CardAssignableRolls = CardAssignableRolls;
//# sourceMappingURL=CardAssignableRolls.js.map