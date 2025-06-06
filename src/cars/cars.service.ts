import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBrand } from './entities/car-brand.entity';
import { CarModel } from './entities/car-model.entity';
import { CreateCarBrandDto } from './dto/create-car-brand.dto';
import { CreateCarModelDto } from './dto/create-car-model.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarBrand)
    private carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
  ) {}

  async createBrand(createCarBrandDto: CreateCarBrandDto): Promise<CarBrand> {
    const brand = this.carBrandRepository.create(createCarBrandDto);
    return this.carBrandRepository.save(brand);
  }

  async findAllBrands(): Promise<CarBrand[]> {
    return this.carBrandRepository.find({
      relations: ['models'],
    });
  }

  async findBrandById(id: string): Promise<CarBrand> {
    return this.carBrandRepository.findOne({
      where: { id },
      relations: ['models'],
    });
  }

  async createModel(brandId: string, createCarModelDto: CreateCarModelDto): Promise<CarModel> {
    const brand = await this.findBrandById(brandId);
    
    if (!brand) {
      throw new Error('Marca non trovata');
    }
    
    const model = this.carModelRepository.create({
      ...createCarModelDto,
      brand,
    });
    
    return this.carModelRepository.save(model);
  }

  async findAllModels(): Promise<CarModel[]> {
    return this.carModelRepository.find({
      relations: ['brand'],
    });
  }

  async findModelById(id: string): Promise<CarModel> {
    return this.carModelRepository.findOne({
      where: { id },
      relations: ['brand'],
    });
  }

  async findModelsByBrand(brandId: string): Promise<CarModel[]> {
    return this.carModelRepository.find({
      where: { brand: { id: brandId } },
      relations: ['brand'],
    });
  }
}
