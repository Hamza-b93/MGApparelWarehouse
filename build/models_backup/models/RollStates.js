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
exports.RollStates = void 0;
const typeorm_1 = require("typeorm");
let RollStates = class RollStates {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "RollStateId" }),
    __metadata("design:type", Number)
], RollStates.prototype, "rollStateId", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "CreatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], RollStates.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "UpdatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], RollStates.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "RollState", length: 32 }),
    __metadata("design:type", String)
], RollStates.prototype, "rollState", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "LocationCategory", length: 32 }),
    __metadata("design:type", String)
], RollStates.prototype, "locationCategory", void 0);
RollStates = __decorate([
    typeorm_1.Index("NonClusteredIndex-20210507-101524", ["rollState", "locationCategory"], {
        unique: true,
    }),
    typeorm_1.Index("NonClusteredIndex-20210507-102509", ["rollStateId", "rollState", "locationCategory"], { unique: true }),
    typeorm_1.Index("RollStates_pk", ["rollStateId"], { unique: true }),
    typeorm_1.Index("RollStates_RollState_LocationCategory_uindex", ["rollState", "locationCategory"], { unique: true }),
    typeorm_1.Index("RollStates_RollState_uindex", ["rollState"], { unique: true }),
    typeorm_1.Index("RollStates_RollStateId_uindex", ["rollStateId"], { unique: true }),
    typeorm_1.Entity("RollStates", { schema: "Essentials" })
], RollStates);
exports.RollStates = RollStates;
//# sourceMappingURL=RollStates.js.map