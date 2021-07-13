"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = require("express");
const common_1 = require("@nestjs/common");
const ormconfig_json_1 = __importDefault(require("../ormconfig.json"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // allow file upload of size upto 50mbs.
    app.use(express_1.json({
        limit: '50mb',
    }));
    app.use(express_1.urlencoded({ limit: '50mb', extended: true }));
    // validation pipes allowed globally.
    app.useGlobalPipes(new common_1.ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
    }));
    // enable cors policy to access from outside domains.
    app.enableCors();
    await app.listen(ormconfig_json_1.default.app_port);
}
bootstrap();
//# sourceMappingURL=main.js.map