import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '@shared/decorators/api-controller.decorator';
import { CreateLocationDto } from '@application/locations/dto/create-location.dto';
import { UpdateLocationDto } from '@application/locations/dto/update-location.dto';
import { CreateLocationUseCase } from '@application/locations/use-cases/create-location.use-case';
import { ListLocationsUseCase } from '@application/locations/use-cases/list-locations.use-case';
import { GetLocationUseCase } from '@application/locations/use-cases/get-location.use-case';
import { UpdateLocationUseCase } from '@application/locations/use-cases/update-location.use-case';
import { DeleteLocationUseCase } from '@application/locations/use-cases/delete-location.use-case';
import { ValidationUtil } from '@shared/utils/validation.util';

@ApiController('Localizações')
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly createLocationUseCase: CreateLocationUseCase,
    private readonly listLocationsUseCase: ListLocationsUseCase,
    private readonly getLocationUseCase: GetLocationUseCase,
    private readonly updateLocationUseCase: UpdateLocationUseCase,
    private readonly deleteLocationUseCase: DeleteLocationUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar localizações' })
  @ApiResponse({ status: 200, description: 'Lista de localizações' })
  async list(@Query('ativo') ativo?: string) {
    const ativoBool = ValidationUtil.parseBoolean(ativo);
    return this.listLocationsUseCase.execute(ativoBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar localização por ID' })
  @ApiResponse({ status: 200, description: 'Localização encontrada' })
  @ApiResponse({ status: 404, description: 'Localização não encontrada' })
  async get(@Param('id') id: string) {
    return this.getLocationUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar localização' })
  @ApiResponse({ status: 201, description: 'Localização criada' })
  async create(@Body() dto: CreateLocationDto) {
    return this.createLocationUseCase.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar localização' })
  @ApiResponse({ status: 200, description: 'Localização atualizada' })
  @ApiResponse({ status: 404, description: 'Localização não encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.updateLocationUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar localização' })
  @ApiResponse({ status: 200, description: 'Localização deletada' })
  @ApiResponse({ status: 400, description: 'Não é possível deletar localização com produtos associados' })
  async delete(@Param('id') id: string) {
    return this.deleteLocationUseCase.execute(id);
  }
}

