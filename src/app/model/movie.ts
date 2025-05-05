import { Tag } from './tag';
import { Author } from './author';

export class Movie {
  id?: number;
  title: string;
  subtitle?: string;
  linkId?: string;
  author?: Author;
  tags?: Tag[];
  isOver: boolean;
}
