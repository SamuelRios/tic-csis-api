import { Detection } from '../interfaces/detection.interface';

export class CreateDetectionDto implements Detection {
    cameraName: string
    categoryNumber: string
    latitude: number
    longitude: number
    timestamp: Date
    frame: string

}