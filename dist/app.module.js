"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const detections_module_1 = require("./detections/detections.module");
const detection_entity_1 = require("./detections/entities/detection.entity");
const camera_entity_1 = require("./detections/entities/camera.entity");
const cameraLocation_entity_1 = require("./detections/entities/cameraLocation.entity");
const operator_entity_1 = require("./detections/entities/operator.entity");
const priority_entity_1 = require("./detections/entities/priority.entity");
const status_entity_1 = require("./detections/entities/status.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            detections_module_1.DetectionsModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: '34.19.59.178',
                port: 3306,
                username: 'root',
                password: 'demoday123',
                database: 'detection_teste',
                entities: [detection_entity_1.DetectionEntity, camera_entity_1.CameraEntity, cameraLocation_entity_1.CameraLocationEntity, operator_entity_1.OperatorEntity, priority_entity_1.PriorityEntity, status_entity_1.StatusEntity],
                synchronize: true,
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map