import { UUID } from 'crypto';

export class User {
  id: UUID;
  username: string;
  fullname: string;
  email: string;
  password: string;
  bio: string;
  createdDate: Date;
}
