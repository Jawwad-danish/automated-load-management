import { plainToInstance } from 'class-transformer';
import { PeruseCreateLoadJobResult } from './modules/peruse';

const data = {}; // Peruse response for create load job

const main = () => {
  const instance = plainToInstance(PeruseCreateLoadJobResult, data);
  console.log(instance);
};

main();
