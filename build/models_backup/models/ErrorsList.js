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
exports.ErrorsList = void 0;
const typeorm_1 = require("typeorm");
let ErrorsList = class ErrorsList {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "ErrorId" }),
    __metadata("design:type", Number)
], ErrorsList.prototype, "errorId", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "CreatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], ErrorsList.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "UpdatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], ErrorsList.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "ErrorType", length: 32 }),
    __metadata("design:type", String)
], ErrorsList.prototype, "errorType", void 0);
__decorate([
    typeorm_1.Column("int", { name: "ErrorNumber" }),
    __metadata("design:type", Number)
], ErrorsList.prototype, "errorNumber", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "ErrorMessage", length: 64 }),
    __metadata("design:type", String)
], ErrorsList.prototype, "errorMessage", void 0);
ErrorsList = __decorate([
    typeorm_1.Index("Errors_ErrorId_uindex", ["errorId"], { unique: true }),
    typeorm_1.Index("Errors_ErrorMessage_uindex", ["errorMessage"], { unique: true }),
    typeorm_1.Index("Errors_ErrorNumber_uindex", ["errorNumber"], { unique: true }),
    typeorm_1.Index("Errors_pk", ["errorId"], { unique: true }),
    typeorm_1.Entity("ErrorsList", { schema: "Logging" })
], ErrorsList);
exports.ErrorsList = ErrorsList;
//# sourceMappingURL=ErrorsList.js.map