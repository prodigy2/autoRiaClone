# AutoRia Clone

Un clone moderno della piattaforma AutoRia per la vendita di automobili, sviluppato con NestJS, TypeORM e Docker.

## Caratteristiche Principali

- **Sistema di Ruoli Flessibile**: Acquirente, Venditore, Manager, Amministratore
- **Tipi di Account**: Base (1 annuncio) e Premium (annunci illimitati + statistiche)
- **Gestione Annunci Auto**: Creazione, modifica, ricerca e validazione automatica
- **Supporto Multi-valuta**: USD, EUR, UAH con aggiornamento quotidiano dei tassi
- **Architettura Modulare**: Facilmente estendibile per supportare future funzionalità
- **Containerizzazione**: Pronto per il deployment su AWS

## Requisiti di Sistema

- Docker e Docker Compose
- Node.js 18+ (solo per sviluppo locale)
- PostgreSQL 14+ (gestito tramite Docker)

## Installazione e Avvio

### Utilizzo con Docker (Consigliato)

1. Clonare il repository:
   ```bash
   git clone https://github.com/yourusername/autoria-clone.git
   cd autoria-clone
   ```

2. Configurare le variabili d'ambiente:
   ```bash
   cp .env.example .env
   # Modificare le variabili nel file .env secondo necessità
   ```

3. Avviare i container Docker:
   ```bash
   docker-compose up -d
   ```

4. L'applicazione sarà disponibile all'indirizzo: `http://localhost:3000`
   L'interfaccia di pgAdmin sarà disponibile all'indirizzo: `http://localhost:5050`

### Installazione per Sviluppo Locale

1. Clonare il repository:
   ```bash
   git clone https://github.com/yourusername/autoria-clone.git
   cd autoria-clone
   ```

2. Installare le dipendenze:
   ```bash
   npm install
   ```

3. Configurare le variabili d'ambiente:
   ```bash
   cp .env.example .env
   # Modificare le variabili nel file .env secondo necessità
   ```

4. Avviare il database PostgreSQL con Docker:
   ```bash
   docker-compose up -d postgres redis
   ```

5. Avviare l'applicazione in modalità sviluppo:
   ```bash
   npm run start:dev
   ```

## Struttura del Progetto

```
autoria-clone/
├── src/                    # Codice sorgente
│   ├── auth/               # Modulo di autenticazione
│   ├── users/              # Gestione utenti
│   ├── roles/              # Gestione ruoli e permessi
│   ├── cars/               # Gestione marche e modelli auto
│   ├── ads/                # Gestione annunci
│   ├── currency/           # Gestione valute e tassi di cambio
│   └── notifications/      # Sistema di notifiche
├── test/                   # Test unitari e di integrazione
├── docker/                 # Configurazioni Docker
├── config/                 # File di configurazione
└── docker-compose.yml      # Configurazione Docker Compose
```

## API Documentation

La documentazione Swagger dell'API è disponibile all'indirizzo: `http://localhost:3000/api`

## Sistema di Ruoli e Permessi

Il sistema utilizza un approccio RBAC (Role-Based Access Control) con permessi granulari:

### Ruoli Predefiniti

1. **Acquirente**
   - Può visualizzare annunci e contattare venditori

2. **Venditore (Base)**
   - Può creare un solo annuncio
   - Può gestire i propri annunci

3. **Venditore (Premium)**
   - Può creare annunci illimitati
   - Può visualizzare statistiche degli annunci

4. **Manager**
   - Può moderare annunci
   - Può gestire utenti (limitato)

5. **Amministratore**
   - Accesso completo a tutte le funzionalità

### Estensibilità

Il sistema è progettato per supportare facilmente l'aggiunta di nuovi ruoli e permessi, come quelli per le concessionarie auto previste in futuro.

## Gestione Annunci

Gli annunci vengono automaticamente controllati per verificare la presenza di linguaggio inappropriato. Il processo di validazione include:

1. Controllo automatico del contenuto
2. Possibilità di modificare l'annuncio fino a 3 volte in caso di rifiuto
3. Notifica ai manager per annunci problematici

## Supporto Multi-valuta

Il sistema supporta prezzi in USD, EUR e UAH:

- I prezzi vengono inseriti in una valuta principale
- Conversione automatica nelle altre valute
- Aggiornamento quotidiano dei tassi di cambio

## Test

Per eseguire i test unitari:

```bash
npm run test
```

Per eseguire i test end-to-end:

```bash
npm run test:e2e
```

## Deployment su AWS

Per il deployment su AWS, seguire questi passaggi:

1. Configurare le credenziali AWS
2. Modificare le variabili d'ambiente per la produzione
3. Utilizzare AWS ECS o Kubernetes per il deployment dei container

## Licenza

Questo progetto è rilasciato sotto licenza MIT.
