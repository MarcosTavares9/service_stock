import { Location } from '../entities/location.entity';

export interface ILocationRepository {
  findById(id: string): Promise<Location | null>;
  findAll(params?: { ativo?: boolean }): Promise<Location[]>;
  findByName(nome: string): Promise<Location | null>;
  create(location: Location): Promise<Location>;
  update(location: Location): Promise<Location>;
  delete(id: string): Promise<void>;
}

