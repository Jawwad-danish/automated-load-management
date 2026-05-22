import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

export class SQSManager {
  private readonly client: SQSClient;

  constructor(private readonly queueUrl: string) {
    this.client = new SQSClient({
      region: 'us-east-1',
    });
  }

  async sendMessage(payload: any): Promise<void> {
    console.log(`Sending message to ${this.queueUrl}`);
    try {
      await this.client.send(
        new SendMessageCommand({
          MessageBody: JSON.stringify(payload),
          QueueUrl: this.queueUrl,
        }),
      );
    } catch (error) {
      console.error(
        `Could not send payload to queue`,
        JSON.stringify(payload),
        this.queueUrl,
      );
      throw error;
    }
  }
}
