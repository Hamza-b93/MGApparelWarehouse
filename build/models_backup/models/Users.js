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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
let Users = class Users {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "UserId" }),
    __metadata("design:type", Number)
], Users.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "CreatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "UpdatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "UserName", length: 16 }),
    __metadata("design:type", String)
], Users.prototype, "userName", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "UserPassword", length: 8 }),
    __metadata("design:type", String)
], Users.prototype, "userPassword", void 0);
Users = __decorate([
    typeorm_1.Index("ClusteredIndex-20210507-111606", ["userId"], { unique: true }),
    typeorm_1.Index("NonClusteredIndex-20210507-111613", ["userName", "userPassword", "userId"], { unique: true }),
    typeorm_1.Index("Users_pk", ["userId"], { unique: true }),
    typeorm_1.Index("Users_UserId_uindex", ["userId"], { unique: true }),
    typeorm_1.Index("Users_UserName_uindex", ["userName"], { unique: true }),
    typeorm_1.Entity("Users", { schema: "Essentials" })
], Users);
exports.Users = Users;
//# sourceMappingURL=Users.js.map