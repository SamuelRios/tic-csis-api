import { Detections } from '../interfaces/detections.interface';

export class CreateDetectionsDto implements Detections {
    cameraName: string
    latitude: number
    longitude: number
    categoryName: string
    timestamp: Date
    frame: string

}