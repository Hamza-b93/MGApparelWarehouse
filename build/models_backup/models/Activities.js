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
exports.Activities = void 0;
const typeorm_1 = require("typeorm");
let Activities = class Activities {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "ActivityId" }),
    __metadata("design:type", Number)
], Activities.prototype, "activityId", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "CreatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Activities.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "UpdatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Activities.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column("date", { name: "UpdatedAtDate", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Activities.prototype, "updatedAtDate", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "ActivityStatus", length: 10 }),
    __metadata("design:type", String)
], Activities.prototype, "activityStatus", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "StartTime", nullable: true }),
    __metadata("design:type", Date)
], Activities.prototype, "startTime", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "EndTime", nullable: true }),
    __metadata("design:type", Date)
], Activities.prototype, "endTime", void 0);
__decorate([
    typeorm_1.Column("decimal", {
        name: "SmallWaste",
        nullable: true,
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], Activities.prototype, "smallWaste", void 0);
__decorate([
    typeorm_1.Column("decimal", {
        name: "LargeWaste",
        nullable: true,
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], Activities.prototype, "largeWaste", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "Shift", nullable: true, length: 8 }),
    __metadata("design:type", String)
], Activities.prototype, "shift", void 0);
Activities = __decorate([
    typeorm_1.Index("Activities_ActivityId_uindex", ["activityId"], { unique: true }),
    typeorm_1.Index("Activities_pk", ["activityId"], { unique: true }),
    typeorm_1.Index("ClusteredIndex-20210507-111751", ["activityId"], { unique: true }),
    typeorm_1.Index("NonClusteredIndex-20210507-111802", [
        "startTime",
        "endTime",
        "smallWaste",
        "largeWaste",
        "shift",
        "activityStatus",
        "activityId",
    ], { unique: true }),
    typeorm_1.Index("NonClusteredIndex-20210507-112014", [
        "updatedAt",
        "startTime",
        "endTime",
        "smallWaste",
        "largeWaste",
        "activityStatus",
        "activityId",
    ], { unique: true }),
    typeorm_1.Entity("Activities", { schema: "Data" })
], Activities);
exports.Activities = Activities;
//# sourceMappingURL=Activities.js.map