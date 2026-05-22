import { IsArray, IsString, IsUUID } from 'class-validator';

export class Identity {
  @IsString()
  @IsUUID()
  id: string;
}

export class Identities {
  @IsArray()
  @IsUUID(4, { each: true })
  id: string[];
}
