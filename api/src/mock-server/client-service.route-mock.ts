import express, { Request, Response, Router } from 'express';
import * as client from './resources/clients/client.json';
import * as clientBankAccount from './resources/clients/clientBankAccount.json';

export const clientRouter: Router = express.Router();

clientRouter.get('/get-all-clients', (_req: Request, res: Response) => {
  console.log(`Sending response for fetching all client statuses`);
  const items = [client];
  res.send({
    items: items,
    pagination: {
      page: 1,
      itemsPerPage: 10,
      totalItems: items.length,
      totalPages: 1,
    },
  });
  res.statusCode = 400;
});

clientRouter.get('/getByIds/id', (req: Request, res: Response) => {
  console.log(`Sending response for fetching clients`);
  const clientIds = req.query.id as string[];
  const items = clientIds.map((clientId) => buildMockClient(clientId));
  res.send({
    items: items,
    pagination: {
      page: 1,
      itemsPerPage: 10,
      totalItems: items.length,
      totalPages: 1,
    },
  });
});

clientRouter.get('/getByEmail/:email', (req: Request, res: Response) => {
  console.log(`Sending response for fetching client by email`);
  const clientEmail = req.params.email as string;
  const response = buildMockClient();
  response.email = clientEmail;
  res.send(response);
});

clientRouter.get('/:id/bank-accounts', (req: Request, res: Response) => {
  console.log(
    `Sending response for fetching client bank account for client with id ${req.params.id}`,
  );
  res.send([clientBankAccount]);
});

clientRouter.get('/:id', (req: Request, res: Response) => {
  console.log(`Sending response for fetching client with id ${req.params.id}`);
  res.send(buildMockClient(req.params.id));
});

function buildMockClient(clientId?: string) {
  const response = { ...client };
  if (clientId) {
    response.id = clientId;
  }
  return response;
}
