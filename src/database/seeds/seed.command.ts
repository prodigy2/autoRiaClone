import { Command, CommandRunner } from 'nest-commander';
import { SeedService } from './seed.service';

@Command({ name: 'seed', description: 'Popola il database con dati iniziali' })
export class SeedCommand extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.seedService.seed();
      console.log('Seed completato con successo!');
    } catch (error) {
      console.error('Errore durante il seed:', error);
    } finally {
      process.exit(0);
    }
  }
}
