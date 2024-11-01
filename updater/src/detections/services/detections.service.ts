import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateDetectionDto } from '../dto/create-detection.dto';
import { DetectionEntity } from '../entities/detection.entity';
import { CameraEntity } from '../entities/camera.entity';
import { CameraService } from './camera.service';
import { CameraLocationService } from './cameraLocation.service';
import { CameraLocationEntity } from '../entities/cameraLocation.entity';
import { PriorityService } from './priority.service';
import { StatusService } from './status.service';
import { UserService } from '../../users/services/user.service';
import { StatusEntity } from '../entities/status.entity';
// import { UserEntity } from '../entities/user.entity';
import { DetectionGateway } from '../websockets/detection/detection.gateway';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PriorityEntity } from '../entities/priority.entity';
import { ClassPriorityEnum } from '../enum/classPriority.enum';
import { UpdateDetectionDto } from '../dto/update-detection.dto';
import { DetectionChangesEntity } from '../entities/detectionChangesHistory.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { DetectionNoteEntity } from '../entities/detectionNote.entity';

@Injectable()
export class DetectionsService {
  private urlMonitorAPI;
  
  constructor(
    @InjectRepository(DetectionEntity)
    private detectionsRepository: Repository<DetectionEntity>,
    @InjectRepository(DetectionChangesEntity)
    private detectionChangesRepository: Repository<DetectionChangesEntity>,
    @InjectRepository(DetectionNoteEntity)
    private readonly detectionNoteRepository: Repository<DetectionNoteEntity>,
    private readonly cameraService: CameraService,
    private readonly cameraLocationService: CameraLocationService,
    private readonly priorityService: PriorityService,
    private readonly statusService: StatusService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => DetectionGateway))
    private readonly detectionGateway: DetectionGateway,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.urlMonitorAPI = config.get("MONITOR_API_URL");
  }

  async findAll(): Promise<DetectionEntity[]> {
    return await this.detectionsRepository.find();
  }
  async findOneById(id: number): Promise<DetectionEntity> {
    
    const detection = await this.detectionsRepository.findOne({
      where: { id }, relations: ['camera', 'location', 'assignedTo', 'priority', 'status']
    });

    if (!detection) {
      throw new NotFoundException(`Detecção com ID ${id} não encontrada`);
    }

    return detection;
  }
  
  async getAllActiveDetections(): Promise<DetectionEntity[]> {
    return this.detectionsRepository.find({
      where: {
        status: {
          statusId: Not(2)
        }
      },
      relations: ['camera', 'location', 'assignedTo', 'priority', 'status']
    });
  }

  async create(
    cDetectionDto: CreateDetectionDto,
    framePath: string
  ): Promise<DetectionEntity> {
    console.log(cDetectionDto.timestamp);
    const detectionTimestamp = new Date(cDetectionDto.timestamp);
    const { camera, cameraLocation } = await this.getDetectionCameraAndLocation(
      cDetectionDto.cameraName, detectionTimestamp
    );
    const detection: DetectionEntity = this.detectionsRepository.create();
    detection.category = cDetectionDto.category;
    detection.assignedTo = null;
    detection.framePath = framePath;
    detection.timestamp = detectionTimestamp;
    detection.location = cameraLocation;
    detection.camera = camera;
    detection.status = await this.getStatus("Aberto");
    detection.priority = await this.getPriority(ClassPriorityEnum.getInitialPriority(cDetectionDto.category));
    console.log("vou salvar detecção")
    const savedDetection = await this.detectionsRepository.save(detection);
    this.detectionGateway.sendDetectionCreated(savedDetection);
    return savedDetection;
  }

  async getPriority(priorityName: string): Promise<PriorityEntity> {
      let priority: PriorityEntity = await this.priorityService.findByName(priorityName);
      if(!priority)
        priority = await this.priorityService.create({priorityName: priorityName});
      return priority;
  }

  async closeDetection(detectionId: number): Promise<DetectionEntity | null> {
    const detection = await this.detectionsRepository.findOne({ where: { id: detectionId, status: {statusId: Not(2)} }, relations: ['camera'] });
    
    if (!detection) {
      return null;
    }

    detection.status = await this.getStatus("Fechado");
    const closedDetection = await this.detectionsRepository.save(detection);
    if(closedDetection){
      this.detectionGateway.sendDetectionClosed(detectionId);
      console.log(await this.notifyClosedDetection(closedDetection.camera.name, closedDetection.category));
    }
    return closedDetection;
  }

  
  private async notifyClosedDetection(cameraName: string, category: string){
    try {
     const response = await firstValueFrom(
          this.httpService.post(`${this.urlMonitorAPI}detection/clear/${cameraName}/${category}`),
      );
      if(response?.status == 201)
       return response.data;
    } catch (error) {
        console.log("ERRO: notifyClosedDetection")
        // console.error('Error fetching data from API', error);
        throw error;
    }
  }

  private async getStatus(statusName: string): Promise<StatusEntity> {
    let status: StatusEntity = await this.statusService.findByName(statusName);
    if(!status)
      status = await this.statusService.create({statusName: statusName});
    return status;
  }

  // private async getUser(userName: string){
  //   let user: UserEntity = await this.userService.findByName(userName);
  //   if(!user)
  //     user = await this.userService.create({name: userName});
  //   return user;
  // }


  private async getDetectionCameraAndLocation(cameraName: string, timestamp: Date) {
    let camera: CameraEntity = await this.cameraService.findByName(cameraName);
    

    if (!camera) {
      camera = await this.cameraService.create({ name: cameraName, hasGps: false });
    }
    
    let cameraLocation: CameraLocationEntity = await this.cameraLocationService.findActiveByCameraId(camera.cameraId);
    return { camera, cameraLocation };
  }


  async changeDetectionPriority(detectionId: number, newPriority:string){
    const priority = await this.getPriority(newPriority);
    if(priority){
      const detection = await this.findOneById(detectionId);
      if(detection){
        detection.priority = priority;
        return await this.detectionsRepository.save(detection);
      }
    }
  }

  async changeDetectionStatus(detectionId: number, newStatus:string){
    const status = await this.getStatus(newStatus);
    if(status){
      const detection = await this.findOneById(detectionId);
      if(detection){
        detection.status = status;
        return await this.detectionsRepository.save(detection);
      }
    }
  }

  async updateDetection(
    id: number,
    updateDetectionDto: UpdateDetectionDto
  ): Promise<DetectionEntity> {
    const detection = await this.detectionsRepository.findOne({ where: { id }, relations: ["status", "priority", "assignedTo"] });
    if (!detection) {
      throw new Error('Detection not found');
    }

    const changes: Partial<DetectionChangesEntity> = {
      detection,
      changedBy: null,
      // changedBy: updateDetectionDto.assignedToId ? await this.findUser(updateDetectionDto.assignedToId) : detection.assignedTo,
      changedAt: new Date(),
    };

    let hasChanges = false;

    if (updateDetectionDto.statusId && updateDetectionDto.statusId !== detection.status.statusId) {
      changes.previousStatus = detection.status;
      changes.newStatus = await this.findStatus(updateDetectionDto.statusId);
      detection.status = changes.newStatus;
      hasChanges = true;
    }

    if (updateDetectionDto.priorityId && updateDetectionDto.priorityId !== detection.priority.priorityId) {
      changes.previousPriority = detection.priority;
      changes.newPriority = await this.findPriority(updateDetectionDto.priorityId);
      detection.priority = changes.newPriority;
      hasChanges = true;
    }

    if (updateDetectionDto.assignedToId && detection.assignedTo && updateDetectionDto.assignedToId !== detection.assignedTo.id) {
      changes.previousAssignedTo = detection.assignedTo;
      changes.newAssignedTo = await this.findUser(updateDetectionDto.assignedToId);
      detection.assignedTo = changes.newAssignedTo;
      hasChanges = true;
    }

    if(updateDetectionDto.note){
      await this.createNote(detection, null, updateDetectionDto.note );
    }

    if (hasChanges) {
      await this.detectionsRepository.save(detection);
      await this.detectionChangesRepository.save(changes);
    }

    return detection;
  }

  private async createNote(detection: DetectionEntity, user: UserEntity, note: string): Promise<DetectionNoteEntity> {
    const newNote = this.detectionNoteRepository.create({
      detection,
      user,
      note,
      createdAt: new Date(),
    });

    return await this.detectionNoteRepository.save(newNote);
  }

  private async findStatus(id: number): Promise<StatusEntity> {
    return await this.statusService.findById(id);
  }

  private async findPriority(id: number): Promise<PriorityEntity> {
    return await this.priorityService.findById(id);
  }

  private async findUser(id: number): Promise<UserEntity> {
    return await this.userService.findById(id);
  }
}
