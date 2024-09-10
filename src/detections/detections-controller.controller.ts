import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDetectionsDto } from './create-detections.dto';

@Controller('detections')
export class DetectionsControllerController {

    @Get()
    getDetections():string {
      return "return detections";
    }

    @Post()
    createDetections(@Body() createDetectiosDto: CreateDetectionsDto){
      console.log(JSON.stringify(createDetectiosDto));

    }

}
