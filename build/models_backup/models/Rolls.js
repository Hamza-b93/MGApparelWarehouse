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
exports.Rolls = void 0;
const typeorm_1 = require("typeorm");
const Allocations_1 = require("./Allocations");
const PackingList_1 = require("./PackingList");
let Rolls = class Rolls {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "RollId" }),
    __metadata("design:type", Number)
], Rolls.prototype, "rollId", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "CreatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Rolls.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "UpdatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Rolls.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column("date", { name: "UpdatedAtDate", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Rolls.prototype, "updatedAtDate", void 0);
__decorate([
    typeorm_1.Column("decimal", { name: "NetWeight", precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], Rolls.prototype, "netWeight", void 0);
__decorate([
    typeorm_1.Column("decimal", { name: "NetLength", precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], Rolls.prototype, "netLength", void 0);
__decorate([
    typeorm_1.Column("int", { name: "ParentRollId", nullable: true }),
    __metadata("design:type", Number)
], Rolls.prototype, "parentRollId", void 0);
__decorate([
    typeorm_1.Column("smallint", { name: "IsChildRoll", default: () => "(0)" }),
    __metadata("design:type", Number)
], Rolls.prototype, "isChildRoll", void 0);
__decorate([
    typeorm_1.Column("int", { name: "RollStateId" }),
    __metadata("design:type", Number)
], Rolls.prototype, "rollStateId", void 0);
__decorate([
    typeorm_1.Column("bit", { name: "IsFresh" }),
    __metadata("design:type", Boolean)
], Rolls.prototype, "isFresh", void 0);
__decorate([
    typeorm_1.Column("nvarchar", {
        name: "GeneratedAt",
        nullable: true,
        length: 16,
        default: () => "NULL",
    }),
    __metadata("design:type", String)
], Rolls.prototype, "generatedAt", void 0);
__decorate([
    typeorm_1.Column("smallint", {
        name: "IsCardAssigned",
        nullable: true,
        default: () => "(0)",
    }),
    __metadata("design:type", Number)
], Rolls.prototype, "isCardAssigned", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "CardAssignmentTimestamp",
        nullable: true,
        default: () => "NULL",
    }),
    __metadata("design:type", Date)
], Rolls.prototype, "cardAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "TransactionAt", nullable: true, length: 16 }),
    __metadata("design:type", String)
], Rolls.prototype, "transactionAt", void 0);
__decorate([
    typeorm_1.Column("int", { name: "ActivityId", nullable: true, default: () => "NULL" }),
    __metadata("design:type", Number)
], Rolls.prototype, "activityId", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "ActivityRollAssignmentTimestamp",
        nullable: true,
        default: () => "NULL",
    }),
    __metadata("design:type", Date)
], Rolls.prototype, "activityRollAssignmentTimestamp", void 0);
__decorate([
    typeorm_1.Column("nvarchar", {
        name: "RackLocatorBin",
        nullable: true,
        length: 16,
        default: () => "NULL",
    }),
    __metadata("design:type", String)
], Rolls.prototype, "rackLocatorBin", void 0);
__decorate([
    typeorm_1.Column("bit", { name: "IsTransactionManual", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], Rolls.prototype, "isTransactionManual", void 0);
__decorate([
    typeorm_1.Column("smallint", {
        name: "Antenna",
        nullable: true,
        default: () => "NULL",
    }),
    __metadata("design:type", Number)
], Rolls.prototype, "antenna", void 0);
__decorate([
    typeorm_1.OneToMany(() => Allocations_1.Allocations, (allocations) => allocations.roll),
    __metadata("design:type", Array)
], Rolls.prototype, "allocations", void 0);
__decorate([
    typeorm_1.ManyToOne(() => PackingList_1.PackingList, (packingList) => packingList.rolls),
    typeorm_1.JoinColumn([
        { name: "PackingListId", referencedColumnName: "packingListId" },
    ]),
    __metadata("design:type", PackingList_1.PackingList)
], Rolls.prototype, "packingListId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Allocations_1.Allocations, (allocations) => allocations.rolls),
    typeorm_1.JoinColumn([
        { name: "LastAllocationId", referencedColumnName: "allocationId" },
    ]),
    __metadata("design:type", Allocations_1.Allocations)
], Rolls.prototype, "lastAllocation", void 0);
Rolls = __decorate([
    typeorm_1.Index("ClusteredIndex-20210507-104751", ["rollId"], { unique: true }),
    typeorm_1.Index("NonClusteredIndex-20210507-104804", ["isCardAssigned", "cardAssignmentTimestamp", "rollStateId", "rollId"], { unique: true }),
    typeorm_1.Index("NonClusteredIndex-20210507-110417", ["netWeight", "rollId"], {
        unique: true,
    }),
    typeorm_1.Index("NonClusteredIndex-20210507-112116", ["activityId", "activityRollAssignmentTimestamp", "rollId"], { unique: true }),
    typeorm_1.Index("Rolls_pk", ["rollId"], { unique: true }),
    typeorm_1.Index("Rolls_RollId_uindex", ["rollId"], { unique: true }),
    typeorm_1.Entity("Rolls", { schema: "Essentials" })
], Rolls);
exports.Rolls = Rolls;
//# sourceMappingURL=Rolls.js.map