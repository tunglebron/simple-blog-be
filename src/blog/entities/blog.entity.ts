import { UUID } from 'crypto';

export class Blog {
  id: UUID;
  title: string;
  categoryId: UUID;
  ownerId: UUID;
  abstract: string;
  content: string;
  author: string;
  tags: string[];
  views: number;
  likes: number;
  createdDate: Date;
  updatedDate: Date;
}
