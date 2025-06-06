# Struttura del Progetto AutoRia Clone

## Architettura Modulare

Il progetto sarà strutturato seguendo i principi di architettura modulare di NestJS, con una chiara separazione delle responsabilità e un design orientato ai domini.

### Moduli Principali

1. **AuthModule**
   - Gestione dell'autenticazione e autorizzazione
   - JWT per l'autenticazione
   - Strategie di autenticazione (locale, JWT)

2. **UsersModule**
   - Gestione degli utenti
   - Profili utente
   - Tipi di account (Base, Premium)

3. **RolesModule**
   - Sistema di ruoli flessibile
   - Gestione dei permessi granulari
   - Supporto per ruoli futuri (concessionarie)

4. **CarsModule**
   - Gestione delle marche e modelli di auto
   - Suggerimenti per nuove marche/modelli

5. **AdsModule**
   - Creazione e gestione degli annunci
   - Sistema di validazione del contenuto
   - Statistiche degli annunci (per account Premium)

6. **CurrencyModule**
   - Gestione delle valute (USD, EUR, UAH)
   - Aggiornamento quotidiano dei tassi di cambio
   - Conversione automatica dei prezzi

7. **NotificationsModule**
   - Sistema di notifiche per utenti e amministratori
   - Email per annunci rifiutati o problematici

## Entità TypeORM

### User
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 'base' })
  accountType: 'base' | 'premium';

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => CarAd, ad => ad.seller)
  ads: CarAd[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Role
```typescript
@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
```

### Permission
```typescript
@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;
}
```

### CarBrand
```typescript
@Entity()
export class CarBrand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CarModel, model => model.brand)
  models: CarModel[];
}
```

### CarModel
```typescript
@Entity()
export class CarModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => CarBrand, brand => brand.models)
  brand: CarBrand;
}
```

### CarAd
```typescript
@Entity()
export class CarAd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: 'USD' | 'EUR' | 'UAH';

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceUSD: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceEUR: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceUAH: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  exchangeRateUSD: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  exchangeRateEUR: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  exchangeRateUAH: number;

  @Column()
  year: number;

  @Column()
  mileage: number;

  @ManyToOne(() => CarModel)
  model: CarModel;

  @ManyToOne(() => User, user => user.ads)
  seller: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'active' | 'rejected' | 'sold';

  @Column({ default: 0 })
  rejectionCount: number;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### CurrencyRate
```typescript
@Entity()
export class CurrencyRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  baseCurrency: string;

  @Column()
  targetCurrency: string;

  @Column('decimal', { precision: 10, scale: 4 })
  rate: number;

  @Column()
  date: Date;
}
```

## Sistema di Permessi

Il sistema di permessi sarà basato su un approccio RBAC (Role-Based Access Control) con la possibilità di assegnare permessi granulari. Questo permetterà di supportare facilmente l'espansione futura per le concessionarie e altri ruoli.

### Permessi di Base

- **users:create** - Creare nuovi utenti
- **users:read** - Visualizzare utenti
- **users:update** - Aggiornare utenti
- **users:delete** - Eliminare utenti
- **ads:create** - Creare annunci
- **ads:read** - Visualizzare annunci
- **ads:update** - Aggiornare annunci
- **ads:delete** - Eliminare annunci
- **ads:moderate** - Moderare annunci
- **brands:create** - Creare marche auto
- **brands:read** - Visualizzare marche auto
- **brands:update** - Aggiornare marche auto
- **brands:delete** - Eliminare marche auto
- **models:create** - Creare modelli auto
- **models:read** - Visualizzare modelli auto
- **models:update** - Aggiornare modelli auto
- **models:delete** - Eliminare modelli auto
- **stats:read** - Visualizzare statistiche

### Configurazione Ruoli Predefiniti

1. **Acquirente**
   - ads:read
   - brands:read
   - models:read

2. **Venditore (Base)**
   - ads:create (limitato a 1 annuncio)
   - ads:read
   - ads:update (solo i propri annunci)
   - ads:delete (solo i propri annunci)
   - brands:read
   - models:read

3. **Venditore (Premium)**
   - ads:create (illimitati)
   - ads:read
   - ads:update (solo i propri annunci)
   - ads:delete (solo i propri annunci)
   - brands:read
   - models:read
   - stats:read

4. **Manager**
   - users:read
   - users:update (limitato)
   - ads:read
   - ads:update
   - ads:delete
   - ads:moderate
   - brands:read
   - brands:update
   - models:read
   - models:update

5. **Amministratore**
   - Tutti i permessi

### Estensibilità per Concessionarie

Per supportare le concessionarie in futuro, aggiungeremo:

1. **Entità Dealership**
   - Relazione con utenti (dipendenti)
   - Ruoli specifici per concessionaria

2. **Permessi Specifici per Concessionarie**
   - dealership:manage
   - dealership:read
   - dealership:update
   - dealership:delete

3. **Ruoli Specifici per Concessionarie**
   - Concessionaria Manager
   - Concessionaria Venditore
   - Concessionaria Meccanico

Questo approccio permetterà di aggiungere facilmente nuovi ruoli e permessi in futuro senza modificare l'architettura di base.
