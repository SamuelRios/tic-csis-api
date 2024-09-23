import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperatorEntity } from '../entities/operator.entity';

@Injectable()
export class OperatorService {
  constructor(
    @InjectRepository(OperatorEntity)
    private operatorRepository: Repository<OperatorEntity>,
  ) {}

  async findByName(operatorName: string): Promise<OperatorEntity | undefined> {
    return this.operatorRepository.findOne({ where: { operatorName: operatorName } });
  }

  async create(operatorData: Partial<OperatorEntity>): Promise<OperatorEntity> {
    const newOperator = this.operatorRepository.create(operatorData);
    return this.operatorRepository.save(newOperator);
  }
}
