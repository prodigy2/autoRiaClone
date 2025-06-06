import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    // In un'implementazione reale, qui ci sarebbe l'integrazione con un servizio di email
    console.log(`Email inviata a ${to} con oggetto "${subject}": ${content}`);
  }

  async notifyManager(subject: string, content: string): Promise<void> {
    // Notifica ai manager (in un'implementazione reale, si otterrebbero gli indirizzi email dal database)
    const managerEmails = ['manager@autoria.com'];
    
    for (const email of managerEmails) {
      await this.sendEmail(email, subject, content);
    }
  }

  async notifyAdRejection(userId: string, adId: string, reason: string): Promise<void> {
    // In un'implementazione reale, si otterrebbe l'email dell'utente dal database
    const userEmail = `user_${userId}@example.com`;
    
    await this.sendEmail(
      userEmail,
      'Il tuo annuncio è stato rifiutato',
      `L'annuncio ${adId} è stato rifiutato per il seguente motivo: ${reason}`
    );
  }
}
