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
exports.FileProcessorService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const FormData = require("form-data");
const fs = require("fs");
let FileProcessorService = class FileProcessorService {
    constructor(httpService) {
        this.httpService = httpService;
        this.urlUpdaterApi = 'http://localhost:3001/detections';
        this.prefixImagePath = 'C:/Users/Formas/Desktop/tic-csis-api/monitor/detection-images/';
    }
    async processFile(filePath, fileName) {
        console.log("processando o arquivo \"" + filePath + "\"");
        console.log(fileName, fileName);
        let detection = this.getJsonFromFile(filePath);
        const responseData = await this.sendDetection(detection, fileName);
        console.log(responseData);
    }
    getJsonFromFile(filePath) {
        const fs = require('fs');
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(data);
            console.log(jsonData);
            return jsonData;
        }
        catch (err) {
            console.error('Error reading or parsing the file; ', err);
        }
    }
    async sendDetection(detection, fileName) {
        try {
            const formData = new FormData();
            formData.append('frame', fs.createReadStream(this.prefixImagePath + fileName.replace(".json", ".png")));
            formData.append('data', JSON.stringify(detection));
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.urlUpdaterApi, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            }));
            return response.data;
        }
        catch (error) {
            console.error('Error fetching data from API', error);
            throw error;
        }
    }
};
exports.FileProcessorService = FileProcessorService;
exports.FileProcessorService = FileProcessorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], FileProcessorService);
//# sourceMappingURL=file-processor.service.js.map