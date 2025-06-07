export interface Filter {
  filter?: string;
  start: number;
  take: number;
  sort?: string;
  order?: 'ASC'|'DESC';
  notValidated?: boolean;
}