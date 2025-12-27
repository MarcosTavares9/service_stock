import { Injectable, Inject } from '@nestjs/common';
import { NotFoundException, ConflictException } from '../exceptions/business.exception';

export interface IBaseRepository<T, ID = string | number> {
  findById(id: ID): Promise<T | null>;
  findAll?(params?: any): Promise<{ data: T[]; total?: number } | T[]>;
  create(entity: Partial<T>): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}

@Injectable()
export abstract class BaseCrudUseCase<T, ID = string | number> {
  protected abstract repository: IBaseRepository<T, ID>;
  protected abstract resourceName: string;

  async findById(id: ID): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(this.resourceName);
    }
    return entity;
  }

  async create(dto: Partial<T>): Promise<T> {
    return this.repository.create(dto);
  }

  async update(id: ID, dto: Partial<T>): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(this.resourceName);
    }

    const updated = { ...entity, ...dto };
    return this.repository.update(updated as T);
  }

  async delete(id: ID): Promise<{ message: string }> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(this.resourceName);
    }

    await this.repository.delete(id);
    return { message: `${this.resourceName} deletado com sucesso` };
  }
}

