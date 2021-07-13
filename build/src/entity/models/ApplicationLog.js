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
exports.ApplicationLog = void 0;
const typeorm_1 = require("typeorm");
let ApplicationLog = class ApplicationLog {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "AppLogId" }),
    __metadata("design:type", Number)
], ApplicationLog.prototype, "appLogId", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "CreatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], ApplicationLog.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "UpdatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], ApplicationLog.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "RequestIpAddr", length: 32 }),
    __metadata("design:type", String)
], ApplicationLog.prototype, "requestIpAddr", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "RequestBody" }),
    __metadata("design:type", String)
], ApplicationLog.prototype, "requestBody", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "RequestType", length: 8 }),
    __metadata("design:type", String)
], ApplicationLog.prototype, "requestType", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "RequestApi", length: 64, default: () => "''" }),
    __metadata("design:type", String)
], ApplicationLog.prototype, "requestApi", void 0);
ApplicationLog = __decorate([
    typeorm_1.Index("ApplicationLog_AppLogId_uindex", ["appLogId"], { unique: true }),
    typeorm_1.Index("ApplicationLog_pk", ["appLogId"], { unique: true }),
    typeorm_1.Entity("ApplicationLog", { schema: "Logging" })
], ApplicationLog);
exports.ApplicationLog = ApplicationLog;
//# sourceMappingURL=ApplicationLog.js.map