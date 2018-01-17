import { Tag } from './tag';
import { Author } from './author';

export interface Movie {
  id?: number;
  title: string;
  subtitle?: string;
  linkType?: string;
  linkId?: string;
  author?: Author;
  tags?: Tag[];
}
