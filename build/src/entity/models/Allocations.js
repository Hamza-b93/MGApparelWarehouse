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
exports.Allocations = void 0;
const typeorm_1 = require("typeorm");
let Allocations = class Allocations {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "AllocationId" }),
    __metadata("design:type", Number)
], Allocations.prototype, "allocationId", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "CreatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Allocations.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "UpdatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Allocations.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column("date", { name: "UpdatedAtDate", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Allocations.prototype, "updatedAtDate", void 0);
__decorate([
    typeorm_1.Column("int", { name: "RollId" }),
    __metadata("design:type", Number)
], Allocations.prototype, "rollId", void 0);
__decorate([
    typeorm_1.Column("nvarchar", {
        name: "AllocationStatus",
        length: 8,
        default: () => "(0)",
    }),
    __metadata("design:type", String)
], Allocations.prototype, "allocationStatus", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "AllocatedTo", length: 32 }),
    __metadata("design:type", String)
], Allocations.prototype, "allocatedTo", void 0);
__decorate([
    typeorm_1.Column("bit", { name: "IsLatest" }),
    __metadata("design:type", Number)
], Allocations.prototype, "isLatest", void 0);
Allocations = __decorate([
    typeorm_1.Entity("Allocations", { schema: "Data" })
], Allocations);
exports.Allocations = Allocations;
//# sourceMappingURL=Allocations.js.map