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
exports.Tag = void 0;
const typeorm_1 = require("typeorm");
const Rolls_1 = require("./Rolls");
let Tag = class Tag {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "TagID" }),
    __metadata("design:type", Number)
], Tag.prototype, "tagId", void 0);
__decorate([
    typeorm_1.Column("datetimeoffset", { name: "CreatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Tag.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetimeoffset", { name: "UpdatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Tag.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: "int", name: "RollID" }),
    __metadata("design:type", Number)
], Tag.prototype, "rollId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Rolls_1.Rolls, (rolls) => rolls.tags),
    typeorm_1.JoinColumn([{ name: "RollID", referencedColumnName: "rollId" }]),
    __metadata("design:type", Rolls_1.Rolls)
], Tag.prototype, "roll", void 0);
Tag = __decorate([
    typeorm_1.Index("PK_TagID", ["tagId"], { unique: true }),
    typeorm_1.Entity("Tag", { schema: "Essentials" })
], Tag);
exports.Tag = Tag;
//# sourceMappingURL=Tag.js.map