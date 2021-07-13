"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuttingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cutting_controller_1 = require("./cutting.controller");
const cutting_service_1 = require("./cutting.service");
const ormconfig_json_1 = __importDefault(require("../../ormconfig.json"));
let CuttingModule = class CuttingModule {
};
CuttingModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: String(ormconfig_json_1.default.type) || 'mssql',
                host: ormconfig_json_1.default.host,
                port: ormconfig_json_1.default.port,
                username: ormconfig_json_1.default.username,
                password: ormconfig_json_1.default.password,
                database: ormconfig_json_1.default.database,
                entities: ormconfig_json_1.default.entities,
                migrations: ormconfig_json_1.default.migrations,
                subscribers: ormconfig_json_1.default.subscribers,
                cli: ormconfig_json_1.default.cli,
                encrypt: ormconfig_json_1.default.encrypt,
                logging: ormconfig_json_1.default.logging,
                logger: 'file',
                synchronize: ormconfig_json_1.default.synchronize,
                maxQueryExecutionTime: 5000,
                cache: true,
                pool: {
                    max: 1000,
                    min: 25,
                    acquireTimeoutMillis: 15000,
                    maxWaitingClients: 250, // max no of requests in queue. rest will be discarded.
                },
                options: {
                    abortTransactionOnError: true,
                    isolation: 'READ_COMMITTED',
                    connectionIsolationLevel: 'REPEATABLE_READ',
                },
            }),
        ],
        providers: [cutting_service_1.CuttingService],
        controllers: [cutting_controller_1.CuttingController],
    })
], CuttingModule);
exports.CuttingModule = CuttingModule;
//# sourceMappingURL=cutting.module.js.map