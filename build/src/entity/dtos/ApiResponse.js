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
class ApiResponse {
    constructor(ErrorNumber, ErrorMessage, Data = null) {
        this.ErrorNumber = ErrorNumber;
        this.ErrorMessage = ErrorMessage;
        this.Data = Data;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], ApiResponse.prototype, "ErrorNumber", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], ApiResponse.prototype, "ErrorMessage", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], ApiResponse.prototype, "Data", void 0);
exports.default = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map