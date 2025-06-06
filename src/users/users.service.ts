import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Creazione del nuovo utente
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles', 'ads'],
    });
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'ads'],
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new Error('Utente non trovato');
    }
    
    // Se viene fornita una nuova password, la hashiamo
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    // Aggiorniamo l'utente
    Object.assign(user, updateUserDto);
    
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async upgradeToPremiun(id: string): Promise<User> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new Error('Utente non trovato');
    }
    
    user.accountType = 'premium';
    
    return this.usersRepository.save(user);
  }

  async countUserAds(userId: string): Promise<number> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['ads'],
    });
    
    return user ? user.ads.length : 0;
  }
}
