import express, { Express } from 'express';
import { brokerRouter } from './broker-service.route-mock';
import { clientRouter } from './client-service.route-mock';

const app: Express = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use('/clients', clientRouter);
app.use('/brokers', brokerRouter);
app.listen(port, () => {
  console.log(`External services mock started on http://localhost:${port}`);
});
