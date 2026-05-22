export const TWILIO_CREDENTIALS_SERVICE = 'TwilioCredentialsService';

export type TwilioCredentials = {
  twilioAccountSid: string;
  twilioAccountAuthToken: string;
  twilioDefaultFromNumber: string;
  twilioMessageLoadManagementUrl: string;
};

export interface TwilioCredentialService {
  getCredentials(): TwilioCredentials;
}
