export interface Detection {
    id?: number;
    cameraName: string;
    categoryNumber: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
    frame: string;
}
