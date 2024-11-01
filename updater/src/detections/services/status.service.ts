import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from '../entities/status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(StatusEntity)
    private statusRepository: Repository<StatusEntity>,
  ) {}

  async findByName(statusName: string): Promise<StatusEntity | undefined> {
    return this.statusRepository.findOne({
      where: { statusName: statusName },
    });
  }

  async create(statusData: Partial<StatusEntity>): Promise<StatusEntity> {
    const newOperator = this.statusRepository.create(statusData);
    return this.statusRepository.save(newOperator);
  }

  async findAll(): Promise<StatusEntity[]> {
    return await this.statusRepository.find();
  }

  async findById(id: number){
    return await this.statusRepository.findOne({ where: { statusId: id } })
  }
}
