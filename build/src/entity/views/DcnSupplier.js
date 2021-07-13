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
exports.DcnSupplier = void 0;
const typeorm_1 = require("typeorm");
let DcnSupplier = class DcnSupplier {
};
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 32,
    }),
    __metadata("design:type", String)
], DcnSupplier.prototype, "Dcn", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 64,
    }),
    __metadata("design:type", String)
], DcnSupplier.prototype, "Supplier", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bigint',
    }),
    __metadata("design:type", Number)
], DcnSupplier.prototype, "TotalRolls", void 0);
DcnSupplier = __decorate([
    typeorm_1.ViewEntity({
        schema: 'Api',
        name: 'vw_DcnSupplier',
    })
], DcnSupplier);
exports.DcnSupplier = DcnSupplier;
//# sourceMappingURL=DcnSupplier.js.map