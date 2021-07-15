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
exports.PackingList = void 0;
const typeorm_1 = require("typeorm");
let PackingList = class PackingList {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "PackingListId" }),
    __metadata("design:type", Number)
], PackingList.prototype, "packingListId", void 0);
__decorate([
    typeorm_1.Column({ type: "int", name: "PackingListCode" }),
    __metadata("design:type", Number)
], PackingList.prototype, "packingListCode", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "CreatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], PackingList.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "UpdatedAt", default: () => "getdate()" }),
    __metadata("design:type", Date)
], PackingList.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column("date", { name: "UploadDate", default: () => "getdate()" }),
    __metadata("design:type", Date)
], PackingList.prototype, "uploadDate", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "Order", length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "order", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "Article", length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "article", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "RollCode", length: 16 }),
    __metadata("design:type", String)
], PackingList.prototype, "rollCode", void 0);
__decorate([
    typeorm_1.Column("decimal", { name: "UploadedLength", precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], PackingList.prototype, "uploadedLength", void 0);
__decorate([
    typeorm_1.Column("decimal", { name: "RollWeight", precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], PackingList.prototype, "rollWeight", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "Color", length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "color", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "Lot", length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "lot", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "InvoiceNo", length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "invoiceNo", void 0);
__decorate([
    typeorm_1.Column("nvarchar", {
        name: "FabricConstruction",
        nullable: true,
        length: 32,
    }),
    __metadata("design:type", String)
], PackingList.prototype, "fabricConstruction", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "Shade", nullable: true, length: 32 }),
    __metadata("design:type", String)
], PackingList.prototype, "shade", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "ReceiptNo", nullable: true, length: 16 }),
    __metadata("design:type", String)
], PackingList.prototype, "receiptNo", void 0);
__decorate([
    typeorm_1.Column("date", { name: "ReceiptDate", nullable: true }),
    __metadata("design:type", Date)
], PackingList.prototype, "receiptDate", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "PRNo", nullable: true, length: 16 }),
    __metadata("design:type", String)
], PackingList.prototype, "prNo", void 0);
__decorate([
    typeorm_1.Column("date", { name: "PRDate", nullable: true }),
    __metadata("design:type", Date)
], PackingList.prototype, "prDate", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "GatePassNo", nullable: true, length: 16 }),
    __metadata("design:type", String)
], PackingList.prototype, "gatePassNo", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "PO", nullable: true, length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "po", void 0);
__decorate([
    typeorm_1.Column("date", { name: "PODate", nullable: true }),
    __metadata("design:type", Date)
], PackingList.prototype, "poDate", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "InspectionNo", nullable: true, length: 32 }),
    __metadata("design:type", String)
], PackingList.prototype, "inspectionNo", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "BiltyNo", nullable: true, length: 16 }),
    __metadata("design:type", String)
], PackingList.prototype, "biltyNo", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "DO", nullable: true, length: 16 }),
    __metadata("design:type", String)
], PackingList.prototype, "do", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "DriverName", nullable: true, length: 32 }),
    __metadata("design:type", String)
], PackingList.prototype, "driverName", void 0);
__decorate([
    typeorm_1.Column("nvarchar", { name: "VehicleNo", nullable: true, length: 16 }),
    __metadata("design:type", String)
], PackingList.prototype, "vehicleNo", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Customer", nullable: true, length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "customer", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Supplier", nullable: true, length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "supplier", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "SupplierLot", nullable: true, length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "supplierLot", void 0);
__decorate([
    typeorm_1.Column("int", { name: "SupplierRollID", nullable: true }),
    __metadata("design:type", Number)
], PackingList.prototype, "supplierRollId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "FabricType", nullable: true, length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "fabricType", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "FabricWidth", nullable: true, length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "fabricWidth", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "GSM", nullable: true, length: 64 }),
    __metadata("design:type", String)
], PackingList.prototype, "gsm", void 0);
__decorate([
    typeorm_1.Column("bit", { name: "ForSampling", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PackingList.prototype, "forSampling", void 0);
PackingList = __decorate([
    typeorm_1.Index("ClusteredIndex-20210507-111419", ["packingListId"], { unique: true }),
    typeorm_1.Index("PackingList_PackingListID_uindex", ["packingListId"], { unique: true }),
    typeorm_1.Index("PackingList_pk", ["packingListId"], { unique: true }),
    typeorm_1.Index("PackingList_RollCode_uindex", ["rollCode"], { unique: true }),
    typeorm_1.Entity("PackingList", { schema: "Essentials" })
], PackingList);
exports.PackingList = PackingList;
//# sourceMappingURL=PackingList.js.map