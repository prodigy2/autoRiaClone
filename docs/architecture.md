# Architettura del Progetto AutoRia Clone

## Diagramma dell'Architettura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client (Web)   │────▶│  NestJS API     │────▶│  PostgreSQL DB  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              │
                              ▼
                        ┌─────────────────┐
                        │                 │
                        │  Redis Cache    │
                        │                 │
                        └─────────────────┘
```

## Architettura Modulare

Il progetto è strutturato secondo i principi di architettura modulare di NestJS, con una chiara separazione delle responsabilità:

### Livelli dell'Applicazione

1. **Controllers**: Gestiscono le richieste HTTP e delegano la logica di business ai servizi
2. **Services**: Contengono la logica di business e interagiscono con i repository
3. **Repositories**: Gestiscono l'accesso ai dati tramite TypeORM
4. **Entities**: Definiscono la struttura dei dati e le relazioni

### Flusso di Autenticazione

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│         │     │             │     │              │     │             │
│ Client  │────▶│ AuthGuard   │────▶│ JWT Strategy │────▶│ Controller  │
│         │     │             │     │              │     │             │
└─────────┘     └─────────────┘     └──────────────┘     └─────────────┘
```

### Sistema di Permessi (RBAC)

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│         │     │             │     │              │     │             │
│ Request │────▶│ RolesGuard  │────▶│ Roles Check  │────▶│ Controller  │
│         │     │             │     │              │     │             │
└─────────┘     └─────────────┘     └──────────────┘     └─────────────┘
```

## Diagramma ER delle Entità Principali

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │    Role     │       │ Permission  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ email       │       │ name        │       │ name        │
│ password    │       │ description │       │ description │
│ firstName   │       └──────┬──────┘       └──────┬──────┘
│ lastName    │              │                     │
│ isActive    │              │                     │
│ accountType │              │                     │
└──────┬──────┘              │                     │
       │                     │                     │
       │                ┌────┴─────────────────────┘
       │                │
       │                ▼
       │       ┌─────────────────┐
       │       │  Role_Permission│
       │       └────────┬────────┘
       │                │
       │                │
       │                │
┌──────┴──────┐  ┌──────┴──────┐  ┌─────────────┐  ┌─────────────┐
│   CarAd     │  │  CarModel   │  │  CarBrand   │  │CurrencyRate │
├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤
│ id          │  │ id          │  │ id          │  │ id          │
│ title       │  │ name        │  │ name        │  │ baseCurrency│
│ description │  └──────┬──────┘  └──────┬──────┘  │ targetCurr  │
│ price       │         │                │         │ rate        │
│ currency    │         │                │         │ date        │
│ year        │         │                │         └─────────────┘
│ mileage     │◀────────┘                │
│ status      │                          │
│ rejectionCnt│                          │
│ views       │                          │
└─────────────┘                          │
                                         │
                                         ▼
```

## Flusso di Validazione degli Annunci

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│ Creazione   │────▶│ Validazione │────▶│ Attivazione │
│ Annuncio    │     │ Contenuto   │     │ Annuncio    │
│             │     │             │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           │ (se contenuto inappropriato)
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │             │     │             │
                    │ Notifica   │────▶│ Revisione   │
                    │ Venditore   │     │ Manager     │
                    │             │     │             │
                    └─────────────┘     └─────────────┘
```

## Architettura Docker

```
┌─────────────────────────────────────────────────────────┐
│                      Docker Network                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │             │  │             │  │                 │  │
│  │  NestJS App │  │  PostgreSQL │  │  Redis Cache    │  │
│  │  Container  │  │  Container  │  │  Container      │  │
│  │             │  │             │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│         │                │                  │           │
│         └────────────────┼──────────────────┘           │
│                          │                              │
│                          ▼                              │
│                  ┌─────────────┐                        │
│                  │             │                        │
│                  │  pgAdmin    │                        │
│                  │  Container  │                        │
│                  │             │                        │
│                  └─────────────┘                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Deployment su AWS

```
┌─────────────────────────────────────────────────────────┐
│                         AWS Cloud                       │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │             │  │             │  │                 │  │
│  │  ECS/EKS    │  │  RDS        │  │  ElastiCache    │  │
│  │  (App)      │  │  (Database) │  │  (Redis)        │  │
│  │             │  │             │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│         │                │                  │           │
│         └────────────────┼──────────────────┘           │
│                          │                              │
│                          ▼                              │
│                  ┌─────────────┐                        │
│                  │             │                        │
│                  │  API Gateway│                        │
│                  │             │                        │
│                  └─────────────┘                        │
│                          │                              │
│                          ▼                              │
│                  ┌─────────────┐                        │
│                  │             │                        │
│                  │  CloudFront │                        │
│                  │             │                        │
│                  └─────────────┘                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
