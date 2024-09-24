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
exports.FolderMonitorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const fs = require("fs");
const path = require("path");
const file_processor_service_1 = require("../file-processor/file-processor.service");
let FolderMonitorService = class FolderMonitorService {
    constructor(fileProcessorService) {
        this.fileProcessorService = fileProcessorService;
        this.directoryPath = './detection-files';
        this.fileName = 'output.json';
        this.simulatedOnce = false;
    }
    handleCron() {
        fs.readdir(this.directoryPath, (err, files) => {
            if (!this.simulatedOnce) {
                if (err) {
                    console.log('Erro ao ler o diretório: ', err.message);
                }
                else {
                    this.simulatedOnce = true;
                    console.log("run:");
                    if (files.findIndex(fileName => fileName == this.fileName) > -1) {
                        const filePath = path.join(this.directoryPath, this.fileName);
                        const jsonFile = this.getJsonFromFile(filePath);
                        this.simulateModel(jsonFile);
                    }
                    else
                        console.log("\"" + this.fileName + "\" file not found");
                }
            }
        });
    }
    simulateModel(jsonFile) {
        console.log('Iniciando execução...');
        setTimeout(() => {
            console.log(jsonFile[0]);
            console.log('Finalizando execução...');
            this.simulateModel(jsonFile);
        }, 1000);
    }
    getJsonFromFile(filePath) {
        const fs = require('fs');
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(data);
            return jsonData;
        }
        catch (err) {
            console.log("caiu aq no erro 32");
        }
    }
};
exports.FolderMonitorService = FolderMonitorService;
__decorate([
    (0, schedule_1.Cron)('* * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FolderMonitorService.prototype, "handleCron", null);
exports.FolderMonitorService = FolderMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_processor_service_1.FileProcessorService])
], FolderMonitorService);
//# sourceMappingURL=folder-monitor.service.js.map