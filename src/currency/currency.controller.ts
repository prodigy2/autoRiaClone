import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';

@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('rates')
  @ApiOperation({ summary: 'Ottieni i tassi di cambio più recenti' })
  @ApiResponse({ status: 200, description: 'Lista dei tassi di cambio' })
  getLatestRates() {
    return this.currencyService.getLatestRates();
  }

  @Post('convert')
  @ApiOperation({ summary: 'Converti una valuta in un\'altra' })
  @ApiResponse({ status: 200, description: 'Conversione effettuata' })
  convertCurrency(
    @Body() data: { amount: number; fromCurrency: string; toCurrency: string },
  ) {
    return this.currencyService.convertCurrency(
      data.amount,
      data.fromCurrency,
      data.toCurrency,
    );
  }

  @Get('update')
  @ApiOperation({ summary: 'Aggiorna manualmente i tassi di cambio' })
  @ApiResponse({ status: 200, description: 'Aggiornamento avviato' })
  updateRates() {
    return this.currencyService.updateCurrencyRates();
  }
}
