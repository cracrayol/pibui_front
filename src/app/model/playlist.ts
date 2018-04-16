import { Tag } from './tag';

export interface Playlist {
    id?: number;
    name?: string;
    public?: boolean;
    mandatoryTags?: Tag[];
    allowedTags?: Tag[];
    forbiddenTags?: Tag[];
}
