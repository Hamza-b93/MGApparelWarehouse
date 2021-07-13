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
exports.PendingActivity = void 0;
const typeorm_1 = require("typeorm");
let PendingActivity = class PendingActivity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], PendingActivity.prototype, "ActivityId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], PendingActivity.prototype, "CreatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], PendingActivity.prototype, "UpdatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
    }),
    __metadata("design:type", Date)
], PendingActivity.prototype, "UpdatedAtDate", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], PendingActivity.prototype, "StartTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], PendingActivity.prototype, "EndTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PendingActivity.prototype, "SmallWaste", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], PendingActivity.prototype, "LargeWaste", void 0);
__decorate([
    typeorm_1.Column({
        type: 'nvarchar',
        length: 8,
    }),
    __metadata("design:type", String)
], PendingActivity.prototype, "Shift", void 0);
PendingActivity = __decorate([
    typeorm_1.ViewEntity({
        schema: 'Api',
        name: 'vw_PendingActivities',
    })
], PendingActivity);
exports.PendingActivity = PendingActivity;
//# sourceMappingURL=PendingActivities.js.map