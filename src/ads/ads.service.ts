import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarAd } from './entities/car-ad.entity';
import { CreateCarAdDto } from './dto/create-car-ad.dto';
import { UpdateCarAdDto } from './dto/update-car-ad.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(CarAd)
    private carAdRepository: Repository<CarAd>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, createCarAdDto: CreateCarAdDto): Promise<CarAd> {
    // Verificare se l'utente può creare un nuovo annuncio
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new Error('Utente non trovato');
    }
    
    // Se l'utente ha un account base, verificare che non abbia già un annuncio attivo
    if (user.accountType === 'base') {
      const adsCount = await this.usersService.countUserAds(userId);
      if (adsCount >= 1) {
        throw new Error('Gli utenti con account base possono pubblicare solo un annuncio');
      }
    }
    
    // Validazione del contenuto (controllo linguaggio)
    if (this.containsInappropriateLanguage(createCarAdDto.description)) {
      throw new Error('L\'annuncio contiene linguaggio inappropriato');
    }
    
    // Creazione dell'annuncio
    const carAd = this.carAdRepository.create({
      ...createCarAdDto,
      seller: { id: userId } as any,
      status: 'active',
    });
    
    return this.carAdRepository.save(carAd);
  }

  async findAll(): Promise<CarAd[]> {
    return this.carAdRepository.find({
      where: { status: 'active' },
      relations: ['model', 'model.brand', 'seller'],
    });
  }

  async findOne(id: string): Promise<CarAd> {
    return this.carAdRepository.findOne({
      where: { id },
      relations: ['model', 'model.brand', 'seller'],
    });
  }

  async update(id: string, userId: string, updateCarAdDto: UpdateCarAdDto): Promise<CarAd> {
    const carAd = await this.carAdRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    
    if (!carAd) {
      throw new Error('Annuncio non trovato');
    }
    
    // Verificare che l'utente sia il proprietario dell'annuncio
    if (carAd.seller.id !== userId) {
      throw new Error('Non sei autorizzato a modificare questo annuncio');
    }
    
    // Validazione del contenuto (controllo linguaggio)
    if (updateCarAdDto.description && this.containsInappropriateLanguage(updateCarAdDto.description)) {
      // Incrementare il contatore di rifiuti
      carAd.rejectionCount += 1;
      
      // Se l'annuncio è stato rifiutato 3 volte, disattivarlo
      if (carAd.rejectionCount >= 3) {
        carAd.status = 'rejected';
        await this.carAdRepository.save(carAd);
        throw new Error('L\'annuncio è stato rifiutato troppe volte ed è stato disattivato');
      }
      
      throw new Error('L\'annuncio contiene linguaggio inappropriato');
    }
    
    // Aggiornamento dell'annuncio
    Object.assign(carAd, updateCarAdDto);
    
    return this.carAdRepository.save(carAd);
  }

  async remove(id: string, userId: string): Promise<void> {
    const carAd = await this.carAdRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    
    if (!carAd) {
      throw new Error('Annuncio non trovato');
    }
    
    // Verificare che l'utente sia il proprietario dell'annuncio
    if (carAd.seller.id !== userId) {
      throw new Error('Non sei autorizzato a eliminare questo annuncio');
    }
    
    await this.carAdRepository.delete(id);
  }

  async incrementViews(id: string): Promise<void> {
    await this.carAdRepository.increment({ id }, 'views', 1);
  }

  private containsInappropriateLanguage(text: string): boolean {
    // Lista di parole inappropriate (esempio semplificato)
    const inappropriateWords = ['parolaccia1', 'parolaccia2', 'parolaccia3'];
    
    // Controllo se il testo contiene parole inappropriate
    return inappropriateWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
  }
}
