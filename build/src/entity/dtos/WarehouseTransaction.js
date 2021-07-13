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
const class_validator_1 = require("class-validator");
class WarehouseTransaction {
}
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], WarehouseTransaction.prototype, "rollId", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], WarehouseTransaction.prototype, "IsManual", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], WarehouseTransaction.prototype, "IsRejected", void 0);
__decorate([
    class_validator_1.IsIn([1, 2, 3, 4, 5]),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], WarehouseTransaction.prototype, "Antenna", void 0);
exports.default = WarehouseTransaction;
//# sourceMappingURL=WarehouseTransaction.js.map