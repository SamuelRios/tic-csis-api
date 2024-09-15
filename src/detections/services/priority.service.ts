import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriorityEntity } from '../entities/priority.entity';

@Injectable()
export class PriorityService {
  constructor(
    @InjectRepository(PriorityEntity)
    private priorityRepository: Repository<PriorityEntity>,
  ) {}

  async findByName(priorityName: string): Promise<PriorityEntity | undefined> {
    return this.priorityRepository.findOne({
      where: { priorityName: priorityName },
    });
  }

  async create(priorityData: Partial<PriorityEntity>): Promise<PriorityEntity> {
    const newOperator = this.priorityRepository.create(priorityData);
    return this.priorityRepository.save(newOperator);
  }
}
