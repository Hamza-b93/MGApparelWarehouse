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
exports.LatestRollAllocations = void 0;
const typeorm_1 = require("typeorm");
let LatestRollAllocations = class LatestRollAllocations {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], LatestRollAllocations.prototype, "AllocationId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], LatestRollAllocations.prototype, "CreatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], LatestRollAllocations.prototype, "UpdatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
    }),
    __metadata("design:type", Date)
], LatestRollAllocations.prototype, "UpdatedAtDate", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
    }),
    __metadata("design:type", Number)
], LatestRollAllocations.prototype, "RollId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 8,
    }),
    __metadata("design:type", String)
], LatestRollAllocations.prototype, "AllocationStatus", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], LatestRollAllocations.prototype, "AllocatedTo", void 0);
LatestRollAllocations = __decorate([
    typeorm_1.ViewEntity({
        schema: 'Api',
        name: 'vw_LatestRollAllocations',
    })
], LatestRollAllocations);
exports.LatestRollAllocations = LatestRollAllocations;
//# sourceMappingURL=LatestRollAllocations.js.map