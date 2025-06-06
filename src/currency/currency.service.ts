import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyRate } from './entities/currency-rate.entity';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(CurrencyRate)
    private currencyRateRepository: Repository<CurrencyRate>,
  ) {}

  @Cron('0 0 * * *') // Ogni giorno a mezzanotte
  async updateCurrencyRates() {
    try {
      // Utilizziamo l'API di Privatbank per ottenere i tassi di cambio
      const response = await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
      const rates = response.data;

      // Salviamo i tassi di cambio nel database
      for (const rate of rates) {
        await this.currencyRateRepository.save({
          baseCurrency: rate.base_ccy,
          targetCurrency: rate.ccy,
          rate: parseFloat(rate.buy),
          date: new Date(),
        });
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dei tassi di cambio:', error);
    }
  }

  async getLatestRates(): Promise<CurrencyRate[]> {
    // Otteniamo i tassi di cambio più recenti per ogni coppia di valute
    const rates = await this.currencyRateRepository
      .createQueryBuilder('rate')
      .select('rate.*')
      .addSelect('MAX(rate.date)', 'max_date')
      .groupBy('rate.baseCurrency, rate.targetCurrency')
      .getRawMany();

    return rates;
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Otteniamo il tasso di cambio più recente
    const rate = await this.currencyRateRepository.findOne({
      where: {
        baseCurrency: fromCurrency,
        targetCurrency: toCurrency,
      },
      order: { date: 'DESC' },
    });

    if (!rate) {
      throw new Error(`Tasso di cambio non trovato per ${fromCurrency} a ${toCurrency}`);
    }

    return amount * rate.rate;
  }
}
