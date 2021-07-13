"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const cutting_controller_1 = require("./cutting/cutting.controller");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const ErrorsList_1 = require("./entity/models/ErrorsList");
const logger_1 = require("./middlewares/logger");
const reports_module_1 = require("./reports/reports.module");
const transactions_controller_1 = require("./transactions/transactions.controller");
const transactions_module_1 = require("./transactions/transactions.module");
const cutting_module_1 = require("./cutting/cutting.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(logger_1.LoggerMiddleware)
            .forRoutes(transactions_controller_1.TransactionsController, cutting_controller_1.CuttingController);
    }
};
AppModule = __decorate([
    common_1.Module({
        imports: [reports_module_1.ReportsModule, transactions_module_1.TransactionsModule, ErrorsList_1.ErrorsList, cutting_module_1.CuttingModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map