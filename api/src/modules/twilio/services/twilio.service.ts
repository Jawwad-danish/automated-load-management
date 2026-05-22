import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  TwilioCredentialService,
  TWILIO_CREDENTIALS_SERVICE,
} from './twilio-credentials.service';
import TwilioClient from 'twilio/lib/rest/Twilio';
import twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);

  private twilioClient: TwilioClient;

  private twilioAccountSid: string;
  private twilioAccountAuthToken: string;
  private twilioMessageLMUrl: string;

  constructor(
    @Inject(TWILIO_CREDENTIALS_SERVICE)
    private readonly twilioCredentialsService: TwilioCredentialService,
  ) {
    const credentials = this.twilioCredentialsService.getCredentials();
    this.twilioAccountSid = credentials.twilioAccountSid;
    this.twilioAccountAuthToken = credentials.twilioAccountAuthToken;
    this.twilioMessageLMUrl = credentials.twilioMessageLoadManagementUrl;

    this.twilioClient = twilio(
      this.twilioAccountSid,
      this.twilioAccountAuthToken,
    );
  }

  getUrl(): string {
    return `${this.twilioMessageLMUrl}`;
  }

  async sendMessage(number: string, message: string): Promise<MessageInstance> {
    this.logger.log(`Sending message to ${number}`);
    return await this.twilioClient.messages.create({
      to: number,
      body: message,
      from: this.twilioCredentialsService.getCredentials()
        .twilioDefaultFromNumber,
    });
  }
}
