import { Tag } from './tag';
import { Author } from './author';

export interface Movie {
  _id?: number;
  title: string;
  subtitle?: string;
  link_type?: string;
  link_id?: string;
  author?: Author;
  tag?: Tag[];
}
