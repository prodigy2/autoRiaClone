import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../roles/entities/permission.entity';
import { User } from '../../users/entities/user.entity';
import { CarBrand } from '../../cars/entities/car-brand.entity';
import { CarModel } from '../../cars/entities/car-model.entity';
import { CarAd } from '../../ads/entities/car-ad.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CarBrand)
    private carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
    @InjectRepository(CarAd)
    private carAdRepository: Repository<CarAd>,
  ) {}

  async seedRoles(): Promise<void> {
    const roles = [
      {
        name: 'admin',
        description: 'Amministratore con accesso completo al sistema',
      },
      {
        name: 'manager',
        description: 'Manager con accesso alla gestione degli annunci e utenti',
      },
      {
        name: 'seller',
        description: 'Venditore con accesso alla creazione e gestione dei propri annunci',
      },
      {
        name: 'buyer',
        description: 'Acquirente con accesso alla visualizzazione degli annunci',
      },
    ];

    for (const roleData of roles) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.rolesRepository.create(roleData);
        await this.rolesRepository.save(role);
        console.log(`Ruolo ${roleData.name} creato con successo`);
      } else {
        console.log(`Ruolo ${roleData.name} già esistente, saltato`);
      }
    }
  }

  async seedPermissions(): Promise<void> {
    const permissions = [
      {
        name: 'create:ads',
        description: 'Permesso di creare annunci',
      },
      {
        name: 'read:ads',
        description: 'Permesso di visualizzare annunci',
      },
      {
        name: 'update:ads',
        description: 'Permesso di aggiornare annunci',
      },
      {
        name: 'delete:ads',
        description: 'Permesso di eliminare annunci',
      },
      {
        name: 'manage:users',
        description: 'Permesso di gestire gli utenti',
      },
      {
        name: 'manage:roles',
        description: 'Permesso di gestire i ruoli',
      },
      {
        name: 'manage:system',
        description: 'Permesso di gestire il sistema',
      },
    ];

    for (const permissionData of permissions) {
      const existingPermission = await this.permissionsRepository.findOne({
        where: { name: permissionData.name },
      });

      if (!existingPermission) {
        const permission = this.permissionsRepository.create(permissionData);
        await this.permissionsRepository.save(permission);
        console.log(`Permesso ${permissionData.name} creato con successo`);
      } else {
        console.log(`Permesso ${permissionData.name} già esistente, saltato`);
      }
    }
  }

  async assignPermissionsToRoles(): Promise<void> {
    // Ottieni tutti i ruoli e i permessi
    const roles = await this.rolesRepository.find({
      relations: ['permissions'],
    });
    const permissions = await this.permissionsRepository.find();

    // Mappa dei permessi per nome per un accesso più facile
    const permissionMap = permissions.reduce((map, permission) => {
      map[permission.name] = permission;
      return map;
    }, {});

    // Assegna i permessi ai ruoli
    for (const role of roles) {
      switch (role.name) {
        case 'admin':
          // L'admin ha tutti i permessi
          role.permissions = [...permissions];
          break;
        case 'manager':
          // Il manager può gestire annunci e utenti
          role.permissions = [
            permissionMap['create:ads'],
            permissionMap['read:ads'],
            permissionMap['update:ads'],
            permissionMap['delete:ads'],
            permissionMap['manage:users'],
          ];
          break;
        case 'seller':
          // Il venditore può creare, leggere e aggiornare i propri annunci
          role.permissions = [
            permissionMap['create:ads'],
            permissionMap['read:ads'],
            permissionMap['update:ads'],
          ];
          break;
        case 'buyer':
          // L'acquirente può solo visualizzare gli annunci
          role.permissions = [
            permissionMap['read:ads'],
          ];
          break;
      }

      await this.rolesRepository.save(role);
      console.log(`Permessi assegnati al ruolo ${role.name}`);
    }
  }

  async seedCarBrands(): Promise<void> {
    const brands = [
      { name: 'Audi' },
      { name: 'BMW' },
      { name: 'Mercedes' },
      { name: 'Volkswagen' },
      { name: 'Toyota' },
      { name: 'Honda' },
      { name: 'Ford' },
      { name: 'Fiat' },
      { name: 'Alfa Romeo' },
      { name: 'Ferrari' },
    ];

    for (const brandData of brands) {
      const existingBrand = await this.carBrandRepository.findOne({
        where: { name: brandData.name },
      });

      if (!existingBrand) {
        const brand = this.carBrandRepository.create(brandData);
        await this.carBrandRepository.save(brand);
        console.log(`Marca ${brandData.name} creata con successo`);
      } else {
        console.log(`Marca ${brandData.name} già esistente, saltata`);
      }
    }
  }

  async seedCarModels(): Promise<void> {
    const brandModels = {
      'Audi': ['A1', 'A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
      'BMW': ['Serie 1', 'Serie 3', 'Serie 5', 'X1', 'X3', 'X5', 'Z4'],
      'Mercedes': ['Classe A', 'Classe C', 'Classe E', 'GLA', 'GLC', 'GLE'],
      'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc', 'T-Cross'],
      'Toyota': ['Yaris', 'Corolla', 'RAV4', 'C-HR', 'Prius', 'Land Cruiser'],
      'Honda': ['Civic', 'CR-V', 'HR-V', 'Jazz', 'Accord'],
      'Ford': ['Fiesta', 'Focus', 'Kuga', 'Puma', 'Mustang'],
      'Fiat': ['500', 'Panda', 'Tipo', '500X', 'Punto'],
      'Alfa Romeo': ['Giulia', 'Stelvio', 'Giulietta', 'Tonale'],
      'Ferrari': ['F8 Tributo', 'Roma', 'SF90 Stradale', '296 GTB'],
    };

    for (const [brandName, models] of Object.entries(brandModels)) {
      const brand = await this.carBrandRepository.findOne({
        where: { name: brandName },
      });

      if (brand) {
        for (const modelName of models) {
          const existingModel = await this.carModelRepository.findOne({
            where: { name: modelName },
            relations: ['brand'],
          });

          if (!existingModel) {
            const model = this.carModelRepository.create({
              name: modelName,
              brand: brand,
            });
            await this.carModelRepository.save(model);
            console.log(`Modello ${modelName} per ${brandName} creato con successo`);
          } else {
            console.log(`Modello ${modelName} per ${brandName} già esistente, saltato`);
          }
        }
      }
    }
  }

async seedUsers(): Promise<void> {
  // Ottieni i ruoli
  const sellerRole = await this.rolesRepository.findOne({ where: { name: 'seller' } });
  const adminRole = await this.rolesRepository.findOne({ where: { name: 'admin' } });
  const managerRole = await this.rolesRepository.findOne({ where: { name: 'manager' } });

  if (!sellerRole) {
    throw new Error('Ruolo seller non trovato. Eseguire prima il seed dei ruoli.');
  }
  if (!adminRole) {
    throw new Error('Ruolo admin non trovato. Eseguire prima il seed dei ruoli.');
  }
  if (!managerRole) {
    throw new Error('Ruolo manager non trovato. Eseguire prima il seed dei ruoli.');
  }

  // Crea utente amministratore
  const adminEmail = 'admin@example.com';
  let existingUser = await this.usersRepository.findOne({ where: { email: adminEmail } });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password', 10);
    const adminUser = this.usersRepository.create({
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      accountType: 'internal',
      roles: [adminRole],
    });
    await this.usersRepository.save(adminUser);
    console.log('Utente amministratore creato con successo');
  } else {
    console.log('Utente amministratore già esistente, saltato');
  }

  // Crea utente manager
  const managerEmail = 'manager@example.com';
  existingUser = await this.usersRepository.findOne({ where: { email: managerEmail } });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password', 10);
    const managerUser = this.usersRepository.create({
      email: managerEmail,
      password: hashedPassword,
      firstName: 'Manager',
      lastName: 'User',
      isActive: true,
      accountType: 'internal',
      roles: [managerRole],
    });
    await this.usersRepository.save(managerUser);
    console.log('Utente manager creato con successo');
  } else {
    console.log('Utente manager già esistente, saltato');
  }
  // Crea 5 utenti normali
  for (let i = 1; i <= 5; i++) {
    const username = `user${i}`;
    const existingUser = await this.usersRepository.findOne({
      where: { email: `${username}@example.com` },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password', 10);
      const user = this.usersRepository.create({
        email: `${username}@example.com`,
        password: hashedPassword,
        firstName: `Nome${i}`,
        lastName: `Cognome${i}`,
        isActive: true,
        accountType: 'base',
        roles: [sellerRole],
      });
      await this.usersRepository.save(user);
      console.log(`Utente normale ${username} creato con successo`);
    } else {
      console.log(`Utente normale ${username} già esistente, saltato`);
    }
  }

  // Crea 5 utenti premium
  for (let i = 1; i <= 5; i++) {
    const username = `premiumuser${i}`;
    const existingUser = await this.usersRepository.findOne({
      where: { email: `${username}@example.com` },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password', 10);
      const user = this.usersRepository.create({
        email: `${username}@example.com`,
        password: hashedPassword,
        firstName: `PremiumNome${i}`,
        lastName: `PremiumCognome${i}`,
        isActive: true,
        accountType: 'premium',
        roles: [sellerRole],
      });
      await this.usersRepository.save(user);
      console.log(`Utente premium ${username} creato con successo`);
    } else {
      console.log(`Utente premium ${username} già esistente, saltato`);
    }
  }
}

  async seedCarAds(): Promise<void> {
    // Ottieni tutti gli utenti normali
    const normalUsers = await this.usersRepository.find({
      where: { accountType: 'base' },
    });

    // Ottieni tutti gli utenti premium
    const premiumUsers = await this.usersRepository.find({
      where: { accountType: 'premium' },
    });

    // Ottieni tutti i modelli di auto con le relative marche
    const carModels = await this.carModelRepository.find({
      relations: ['brand'],
    });

    if (carModels.length === 0) {
      throw new Error('Nessun modello di auto trovato. Eseguire prima il seed dei modelli.');
    }

const allowedCurrencies = ['USD', 'EUR', 'UAH'] as const;
type Currency = typeof allowedCurrencies[number];

    // Funzione per generare un annuncio casuale
    const generateRandomAd = (user, model) => {
      const currentYear = new Date().getFullYear();
      const year = Math.floor(Math.random() * 20) + (currentYear - 20); // Anno tra (currentYear-20) e currentYear
      const mileage = Math.floor(Math.random() * 150000) + 1000; // Chilometraggio tra 1000 e 151000
      const price = Math.floor(Math.random() * 50000) + 5000; // Prezzo tra 5000 e 55000
      const currency: Currency = allowedCurrencies[Math.floor(Math.random() * allowedCurrencies.length)];
      const status: 'pending' | 'active' | 'rejected' | 'sold' = 'active';

      return {
        title: `${model.brand.name} ${model.name} ${year}`,
        description: `Bellissima ${model.brand.name} ${model.name} del ${year} con ${mileage} km. Ottime condizioni, unico proprietario, sempre tagliandata presso officina autorizzata. Interni in pelle, climatizzatore, sensori di parcheggio, navigatore satellitare.`,
        price: price,
        currency: currency,
        year: year,
        mileage: mileage,
        model: model,
        seller: user,
        status,
        views: Math.floor(Math.random() * 100), // Visualizzazioni casuali tra 0 e 100
      };
    };

    // Crea 1 annuncio per ogni utente normale
    for (const user of normalUsers) {
      const existingAds = await this.carAdRepository.count({
        where: { seller: { id: user.id } },
      });

      if (existingAds === 0) {
        // Scegli un modello casuale
        const randomModel = carModels[Math.floor(Math.random() * carModels.length)];
        const adData = generateRandomAd(user, randomModel);
        
        const ad = this.carAdRepository.create(adData);
        await this.carAdRepository.save(ad);
        console.log(`Annuncio creato per l'utente normale ${user.email}`);
      } else {
        console.log(`L'utente normale ${user.email} ha già degli annunci, saltato`);
      }
    }

    // Crea 2 annunci per ogni utente premium
    for (const user of premiumUsers) {
      const existingAds = await this.carAdRepository.count({
        where: { seller: { id: user.id } },
      });

      if (existingAds < 2) {
        const adsToCreate = 2 - existingAds;
        
        for (let i = 0; i < adsToCreate; i++) {
          // Scegli un modello casuale
          const randomModel = carModels[Math.floor(Math.random() * carModels.length)];
          const adData = generateRandomAd(user, randomModel);
          
          const ad = this.carAdRepository.create(adData);
          await this.carAdRepository.save(ad);
          console.log(`Annuncio ${i + 1} creato per l'utente premium ${user.email}`);
        }
      } else {
        console.log(`L'utente premium ${user.email} ha già 2 o più annunci, saltato`);
      }
    }
  }

  async seed(): Promise<void> {
    console.log('Inizializzazione dei dati di seed...');
    
    // 1. Crea i ruoli base
    await this.seedRoles();
    
    // 2. Crea i permessi base
    await this.seedPermissions();
    
    // 3. Assegna i permessi ai ruoli
    await this.assignPermissionsToRoles();
    
    // 4. Crea le marche auto
    await this.seedCarBrands();
    
    // 5. Crea i modelli auto
    await this.seedCarModels();
    
    // 6. Crea gli utenti (normali e premium)
    await this.seedUsers();
    
    // 7. Crea gli annunci auto
    await this.seedCarAds();
    
    console.log('Inizializzazione dei dati di seed completata con successo!');
  }
}
