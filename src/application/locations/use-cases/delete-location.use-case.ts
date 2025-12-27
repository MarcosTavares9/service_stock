import { Injectable, Inject } from '@nestjs/common';
import { ILocationRepository } from '@domain/locations/ports/location.repository.port';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { NotFoundException, BusinessException } from '@shared/exceptions/business.exception';

@Injectable()
export class DeleteLocationUseCase {
  constructor(
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string) {
    const location = await this.locationRepository.findById(id);

    if (!location) {
      throw new NotFoundException('Localização');
    }

    const products = await this.productRepository.findByLocation(location.nome);

    if (products.length > 0) {
      throw new BusinessException(
        'Não é possível deletar localização com produtos associados',
      );
    }

    await this.locationRepository.delete(id);

    return { message: 'Localização deletada com sucesso' };
  }
}

